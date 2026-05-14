/**
 * Migration script: converts deprecated `isProject` and `state` frontmatter
 * fields in all MDX posts to entries in the `tags` array, then removes them.
 *
 * Run with: npx tsx scripts/migrate-posts.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const postsDir = path.join(process.cwd(), 'app', 'blog', 'posts');

function migrateFrontmatter(content: string): { content: string; changed: boolean } {
    const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
    const match = frontmatterRegex.exec(content);
    if (!match) return { content, changed: false };

    const frontmatterBlock = match[1];
    const lines = frontmatterBlock.split('\n');

    let isProject = false;
    let state: string | null = null;
    let tagsLineIndex = -1;
    let existingTags: string[] = [];
    let changed = false;

    const filteredLines: string[] = [];

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            filteredLines.push(line);
            continue;
        }

        const key = line.substring(0, colonIndex).trim();
        const rawValue = line.substring(colonIndex + 1).trim().replace(/^['"](.*)['"]$/, '$1');

        if (key === 'isProject') {
            isProject = rawValue === 'true';
            changed = true;
            // Drop this line
        } else if (key === 'state') {
            state = rawValue;
            changed = true;
            // Drop this line
        } else if (key === 'tags') {
            existingTags = rawValue.split(',').map((t) => t.trim()).filter(Boolean);
            tagsLineIndex = filteredLines.length;
            filteredLines.push(line); // placeholder, updated below
        } else {
            filteredLines.push(line);
        }
    }

    if (!changed) return { content, changed: false };

    const tagsSet = new Set(existingTags);
    if (isProject) tagsSet.add('Project');
    if (state) tagsSet.add(state);

    const tagsValue = Array.from(tagsSet).join(', ');

    if (tagsLineIndex >= 0) {
        filteredLines[tagsLineIndex] = `tags: ${tagsValue}`;
    } else {
        filteredLines.push(`tags: ${tagsValue}`);
    }

    const newFrontmatter = `---\n${filteredLines.join('\n')}\n---`;
    const newContent = content.replace(frontmatterRegex, newFrontmatter);

    return { content: newContent, changed: true };
}

function main() {
    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx'));

    for (const file of files) {
        const filePath = path.join(postsDir, file);
        const original = fs.readFileSync(filePath, 'utf-8');
        const { content, changed } = migrateFrontmatter(original);

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✓ Migrated: ${file}`);
        } else {
            console.log(`  Skipped (no changes): ${file}`);
        }
    }

    console.log('\nMigration complete.');
}

main();
