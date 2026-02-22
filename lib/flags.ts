'use server';

import { vercelAdapter } from '@flags-sdk/vercel';
import { flag } from 'flags/next';
import { StyleVariant, isValidStyleVariant, styleOptions } from './style-flag';
import { cookies } from 'next/headers';

export const styleFlag = flag<StyleVariant>({
    key: "style",
    options: styleOptions,
    decide: async ({ cookies: requestCookies }) => {
        console.log("cookies=", requestCookies.getAll())
        const styleCookie = requestCookies.get('style_flag');
        console.log("Style cookie:", styleCookie)
        const value = styleCookie?.value as StyleVariant | undefined;

        // Validate the cookie value against known styles
        if (value && isValidStyleVariant(value)) {
            return value;
        }

        return "classical";
    },
    adapter: vercelAdapter()
});

export async function setStyleFlag(style: StyleVariant) {
    const cookieStore = await cookies();
    cookieStore.set('style_flag', style, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
}