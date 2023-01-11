import { google } from "worker-auth-providers";

export const onRequestGet: PagesFunction<{ GOOGLE_CLIENT_ID: string, GOOGLE_REDIRECT_PROD_URL: string }> = async ({ env }) => {
    try {
        const location = await google.redirect({
            options: {
                clientId: env.GOOGLE_CLIENT_ID as string,
                redirectUrl: env.GOOGLE_REDIRECT_PROD_URL as string,
            }
        });
        return new Response(
            null,
            {
                status: 302,
                headers: {
                    location,
                },
            }
        )
    } catch (e: any) {
        return new Response(
            JSON.stringify({
                error: 'Invalid request',
                message: `${e.message}`
            }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}