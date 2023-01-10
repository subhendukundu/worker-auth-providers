import { github } from "worker-auth-providers";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { NextRequest } from "next/server";

export const config = {
    runtime: "experimental-edge",
};

const clientId = process.env.GITHUB_CLIENT_ID as string;

const clientSecret = process.env.GITHUB_CLIENT_SECRET as string;

function generateJWT(user: any) {
    const claims: any = {
        user_id: user?.id,
    };
    const secret = process.env.ENCODE_JWT_TOKEN as string;
    console.log("[claims, scret]", claims, secret);
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...claims }, secret, { algorithm: 'HS256' });
}

async function createUser(user: any) {
    console.log(user.id);
    const profile = {
        id: user.id,
        name: user.name,
        image: user.avatar_url,
        email: user.email,
    };
    //@ts-ignore
    return await WORKER_AUTH_PROVIDERS_STORE.put(user.id, JSON.stringify(profile));
}

export default async function (request: NextRequest) {
    try {
        const { user: providerUser } = await github.users({
            options: { clientSecret, clientId },
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
                },
            }
        )
    }
};
