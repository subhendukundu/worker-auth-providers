import { github } from "worker-auth-providers";
import jwt from "jsonwebtoken";

const clientId = process.env.VITEDGE_GITHUB_CLIENT_ID;

const clientSecret = process.env.VITEDGE_GITHUB_CLIENT_SECRET;

function generateJWT(user: any) {
    const claims: any = {
        user_id: user?.id,
    };
    const secret = process.env.VITEDGE_ENCODE_JWT_TOKEN;
    console.log("[claims, scret]", claims, secret);
    return jwt.sign(claims, secret, { algorithm: "HS256", expiresIn: "24h" });
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

export default {
    async handler({ request }: any) {
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
