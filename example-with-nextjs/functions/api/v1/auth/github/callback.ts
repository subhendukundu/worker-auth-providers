import { github } from "worker-auth-providers";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { NextRequest } from "next/server";

function generateJWT(user: any, secret: string) {
    const claims: any = {
        user_id: user?.id,
    };
    console.log("[claims, scret]", claims, secret);
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...claims }, secret, { algorithm: 'HS256' });
}

async function createUser(user: any, env: any) {
    console.log(user.id);
    const profile = {
        id: user.id,
        name: user.name,
        image: user.avatar_url,
        email: user.email,
    };
    //@ts-ignore
    return await env.WORKER_AUTH_PROVIDERS_STORE.put(user.id, JSON.stringify(profile));
}

export const onRequestGet: PagesFunction<{ GITHUB_CLIENT_ID: string, GITHUB_CLIENT_SECRET: string, ENCODE_JWT_TOKEN: string, WORKER_AUTH_PROVIDERS_STORE: KVNamespace }> = async ({ request, env }) => {
    try {
        const { user: providerUser } = await github.users({
            options: { clientSecret: env.GITHUB_CLIENT_SECRET as string, clientId: env.GITHUB_CLIENT_ID as string },
            request,
        });
        console.log("[providerUser]", providerUser);
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
