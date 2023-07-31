import { discord } from "worker-auth-providers";
import jwt from "@tsndr/cloudflare-worker-jwt";

function generateJWT(user: any) {
    const claims: any = {
        user_id: user?.id,
    };
    const secret = process.env.VITEDGE_ENCODE_JWT_TOKEN as string;
    console.log("[claims, scret]", claims, secret);
    return jwt.sign(claims, secret, { algorithm: "HS256", expiresIn: "24h" });
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

export default {
    async handler({ request }: any) {
        try {
            const { user: providerUser } = await discord.users({
                options: {
                    clientId: process.env.VITEDGE_DISCORD_CLIENT_ID,
                    clientSecret: process.env.VITEDGE_DISCORD_CLIENT_SECRET,
                    redirectUrl: process.env.VITEDGE_DISCORD_REDIRECT_PROD_URL,
                    scope: 'identify email',
                },
                request,
            });
            console.log("[providerUser]", providerUser);
            await createUser(providerUser);
            const jwt = generateJWT(providerUser);
            console.log("[jwt]", jwt);
            const now = new Date();
            now.setTime(now.getTime() + 24 * 3600 * 1000);
            return {
                status: 302,
                headers: {
                    location: "/me",
                    "Set-Cookie": `__Session-worker.auth.providers-token=${jwt}; expires=${now.toUTCString()}; path=/;`,
                },
            };
        } catch (e) {
            console.log("[error]", e?.stack);
            return {
                status: 302,
                headers: {
                    location: "/404",
                },
            };
        }
    },
};
