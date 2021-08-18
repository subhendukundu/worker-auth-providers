import { discord } from "worker-auth-providers";
import jwt from "jsonwebtoken";

function generateJWT(user: any) {
    const claims: any = {
        user_id: (`${  Math.random()}`).substring(2, 12)
    };
    const secret = process.env.VITEDGE_ENCODE_JWT_TOKEN;
    console.log("[claims, scret]", claims, secret);
    return jwt.sign(claims, secret, { algorithm: "HS256", expiresIn: "24h" });
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
            console.log("[error]", JSON.stringify(e));
            return {
                status: 302,
                headers: {
                    location: "/404",
                },
            };
        }
    },
};
