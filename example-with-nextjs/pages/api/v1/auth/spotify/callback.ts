import { spotify } from "worker-auth-providers";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { NextRequest } from "next/server";

export const config = {
    runtime: "experimental-edge",
};

function generateJWT(user: any) {
    const claims: any = {
        user_id: user?.id,
    };
    console.log('[claims]', claims)
    const secret = process.env.ENCODE_JWT_TOKEN as string;
    console.log("[claims, scret]", claims, secret);
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...claims }, secret, { algorithm: 'HS256' });
}

async function createUser(user: any) {
    console.log(user.id);
    const profile = {
        id: user.id,
        name: user.display_name,
        image: user.images[0]?.url,
        email: user.email || null,
    };
    //@ts-ignore
    return await WORKER_AUTH_PROVIDERS_STORE.put(user.id, JSON.stringify(profile));
}

export default async function (request: NextRequest) {
    try {
        const { user: providerUser } = await spotify.users({
            options: {
                clientId: process.env.SPOTIFY_CLIENT_ID as string,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
                redirectUrl: process.env.SPOTIFY_REDIRECT_PROD_URL as string
            },
            request,
        });
        console.log("[providerUser]", providerUser);
        await createUser(providerUser);
        const jwt = generateJWT(providerUser);
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
                }
            }
        )
    }
};
