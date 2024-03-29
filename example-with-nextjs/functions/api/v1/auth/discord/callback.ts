import { discord } from "worker-auth-providers";
import jwt from "@tsndr/cloudflare-worker-jwt";

function generateJWT(user: any, secret: string) {
    const claims: any = {
        user_id: user?.id,
    };
    console.log("[claims, scret]", claims, secret);
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...claims }, secret, { algorithm: 'HS256' });
}

async function createUser(user: any) {
    console.log(user.id);
    const profile = {
        id: user.id,
        name: user.username,
        image: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
        email: user.email,
    }
    //@ts-ignore
    return await WORKER_AUTH_PROVIDERS_STORE.put(user.id, JSON.stringify(profile));
}

export const onRequestGet: PagesFunction<{ DISCORD_CLIENT_ID: string, DISCORD_CLIENT_SECRET: string, DISCORD_REDIRECT_PROD_URL: string, ENCODE_JWT_TOKEN: string }> = async ({ env, request }) => {
    try {
        const { user: providerUser } = await discord.users({
            options: {
                clientId: env.DISCORD_CLIENT_ID as string,
                clientSecret: env.DISCORD_CLIENT_SECRET as string,
                redirectUrl: env.DISCORD_REDIRECT_PROD_URL as string,
                scope: 'identify email',
            },
            request: {
                url: request.url
            },
        });
        console.log("[providerUser]", providerUser);
        await createUser(providerUser);
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
