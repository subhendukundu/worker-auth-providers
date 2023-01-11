import jwt from '@tsndr/cloudflare-worker-jwt';
import { google } from "worker-auth-providers";

function generateJWT(user: any, secret: string) {
    const claims: any = {
        user_id: user?.id,
    };
    console.log("[claims, scret]", claims, secret);
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...claims }, secret, { algorithm: 'HS256' });
}

async function createUser(user: any, env: any) {
    const profile = {
        id: user.id,
        name: user.name,
        image: user.picture,
        email: user.email,
    };
    //@ts-ignore
    return await env.WORKER_AUTH_PROVIDERS_STORE.put(user.id, JSON.stringify(profile));
}

export const onRequestGet: PagesFunction<{ GOOGLE_CLIENT_ID: string, GOOGLE_REDIRECT_PROD_URL: string, GOOGLE_CLIENT_SECRET: string, ENCODE_JWT_TOKEN: string }> = async ({ env, request }) => {
    try {
        const { user: providerUser } = await google.users({
            options: {
                clientId: env.GOOGLE_CLIENT_ID as string,
                clientSecret: env.GOOGLE_CLIENT_SECRET as string,
                redirectUrl: env.GOOGLE_REDIRECT_PROD_URL as string,
            },
            request,
        });
        console.log('[providerUser]', providerUser);
        await createUser(providerUser, env);
        const jwt = generateJWT(providerUser, env.ENCODE_JWT_TOKEN as string);
        console.log("[jwt]", jwt);
        const now = new Date();
        now.setTime(now.getTime() + 24 * 3600 * 1000);
        return new Response(
            null,
            {
                status: 302,
                headers: {
                    location: "/me",
                    "Set-Cookie": `__Session-worker.auth.providers-token=${jwt}; expires=${now.toUTCString()}; path=/;`,
                },
            }
        )
    } catch (e: any) {
        console.log("[error]", e?.stack);
        return new Response(
            null,
            {
                status: 302,
                headers: {
                    location: "/404",
                },
            }
        )
    }
};
