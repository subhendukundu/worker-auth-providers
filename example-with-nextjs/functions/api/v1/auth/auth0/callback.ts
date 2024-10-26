import { auth0 } from "worker-auth-providers";
import jwt from "@tsndr/cloudflare-worker-jwt";

function generateJWT(user: any, secret: string) {
    const claims: any = {
        user_id: user?.sub,
    };
    console.log("[claims, secret]", claims, secret);
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...claims }, secret, { algorithm: 'HS256' });
}

async function createUser(user: any, env: any) {
    console.log(user.sub);
    const profile = {
        id: user.sub,
        name: user.name,
        image: user.picture,
        email: user.email,
    };
    //@ts-ignore
    return await env.WORKER_AUTH_PROVIDERS_STORE.put(user.sub, JSON.stringify(profile));
}

export const onRequestGet: PagesFunction<{ AUTH0_CLIENT_ID: string, AUTH0_CLIENT_SECRET: string, AUTH0_REDIRECT_PROD_URL: string, ENCODE_JWT_TOKEN: string, WORKER_AUTH_PROVIDERS_STORE: KVNamespace }> = async ({ env, request }) => {
    try {
        const { user: providerUser } = await auth0.users({
            options: {
                clientId: env.AUTH0_CLIENT_ID as string,
                clientSecret: env.AUTH0_CLIENT_SECRET as string,
                redirectUrl: env.AUTH0_REDIRECT_PROD_URL as string,
            },
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
