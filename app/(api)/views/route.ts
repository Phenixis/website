import { getViews, hashIp, incrementViews } from "@/lib/redis";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const h = await headers();
        const xff = h.get('x-forwarded-for');
        const ip = (xff?.split(',')[0].trim()) || h.get('x-real-ip') || '127.0.0.1';

        const secret = process.env.IP_HASH_KEY;
        const hashedIp = hashIp(ip, secret);

        await incrementViews(slug, hashedIp);
        const views = await getViews(slug);

        return NextResponse.json({ views });
    } catch (error) {
        console.error('Error tracking views:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        const views = await getViews(slug);

        return NextResponse.json({ views });
    } catch (error) {
        console.error('Error getting views:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
