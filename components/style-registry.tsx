import * as NavComponents from './big/nav';
import * as StyleSelectComponents from './big/style-select';

// ============================================================================
// STYLE VARIANTS
// ============================================================================

export type StyleVariant = "classical" | "modern";

export interface StyleOption {
    value: StyleVariant;
    label: string;
}

export const styleOptions: StyleOption[] = [
    { value: "classical", label: "Classical" },
    { value: "modern", label: "Modern" },
] as const;

// ============================================================================
// COMPONENT GROUPS
// ============================================================================

export type ComponentGroup = "navbar" | "footer" | "styleSelect";

// ============================================================================
// COMPONENT PROPS INTERFACES
// ============================================================================

export interface NavbarVariantProps {
    readonly currentStyle: StyleVariant;
}

export interface FooterVariantProps {
    readonly currentStyle: StyleVariant;
}

export interface StyleSelectVariantProps {
    readonly currentStyle: StyleVariant;
}

// ============================================================================
// COMPONENT REGISTRY
// ============================================================================
//
// This is the central registry mapping all component groups to their styled variants.
// 
// Structure:
//   componentRegistry[componentGroup][styleVariant] = Component
//
// Example usage:
//   const NavComponent = componentRegistry.navbar.classical;
//   // or use the helper:
//   const NavComponent = getComponentVariant('navbar', 'classical');
//
// To add a new component group (e.g., 'sidebar'):
//   1. Add 'sidebar' to ComponentGroup type
//   2. Create SidebarVariantProps interface
//   3. Add sidebar to ComponentRegistry type
//   4. Import sidebar variants and add to registry below
//
// To add a new style (e.g., 'minimal'):
//   1. Add 'minimal' to StyleVariant type
//   2. Add to styleOptions array
//   3. Create component variants for each group
//   4. Add to each group in the registry below
//

export type ComponentRegistry = {
    navbar: Record<StyleVariant, React.ComponentType<NavbarVariantProps>>;
    footer: Record<StyleVariant, React.ComponentType<FooterVariantProps>>;
    styleSelect: Record<StyleVariant, React.ComponentType<StyleSelectVariantProps>>;
};

export const componentRegistry: ComponentRegistry = {
    navbar: {
        classical: NavComponents.NavbarClassical,
        modern: NavComponents.NavbarModern,
    },
    footer: {
        // For now, footer only has one variant (client component)
        // When you create footer variants, add them here:
        // classical: FooterClassical,
        // modern: FooterModern,
    } as any, // Temporary until footer variants are created
    styleSelect: {
        // StyleSelect is the same for all styles, but we can still route through the registry
        classical: StyleSelectComponents.StyleSelectClassical,
        modern: StyleSelectComponents.StyleSelectModern,
    },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a component variant from the registry
 * @param group - Component group (navbar, footer, etc.)
 * @param style - Style variant (classical, modern, etc.)
 * @returns The component for the specified group and style
 */
export function getComponentVariant(
    group: ComponentGroup,
    style: StyleVariant
): React.ComponentType<any> {
    return componentRegistry[group][style];
}

