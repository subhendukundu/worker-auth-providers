import jwt from '@tsndr/cloudflare-worker-jwt';
import { NextRequest } from 'next/server';
import { google } from "worker-auth-providers";

function generateJWT(user: any) {
    const claims: any = {
        user_id: user?.id,
    };
    const secret = process.env.ENCODE_JWT_TOKEN as string;
    console.log("[claims, scret]", claims, secret);
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...claims }, secret, { algorithm: 'HS256' });
}

const options = {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirectUrl: process.env.GOOGLE_REDIRECT_PROD_URL as string,
};

async function createUser(user: any) {
    const profile = {
        id: user.id,
        name: user.name,
        image: user.picture,
        email: user.email,
    };
    //@ts-ignore
    return await WORKER_AUTH_PROVIDERS_STORE.put(user.id, JSON.stringify(profile));
}

export default async function (request: NextRequest) {
    try {
        const { user: providerUser } = await google.users({
            options,
            request,
        });
        console.log('[providerUser]', providerUser);
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
                },
            }
        )
    }
};
