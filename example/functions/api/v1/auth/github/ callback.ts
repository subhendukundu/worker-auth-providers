import { github } from "worker-auth-providers";
import jwt from "jsonwebtoken";

const clientId = process.env.VITEDGE_GITHUB_CLIENT_ID;

const clientSecret = process.env.VITEDGE_GITHUB_CLIENT_SECRET;

function generateJWT(user: any) {
    const claims: any = {
        user_id: (`${  Math.random()}`).substring(2, 12)
    };
    const secret = process.env.VITEDGE_ENCODE_JWT_TOKEN;
    console.log("[claims, scret]", claims, secret);
    return jwt.sign(claims, secret, { algorithm: "HS256", expiresIn: "10h" });
}

export default {
    async handler({ request }: any) {
        try {
            const { user: providerUser, tokens } = await github.users({
                options: { clientSecret, clientId },
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
                    location: "/projects",
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
