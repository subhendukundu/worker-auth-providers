import jwt from 'jsonwebtoken';
import { google } from "worker-auth-providers";

function generateJWT(user: any) {
    const claims: any = {
        user_id: user?.id,
    };
    const secret = process.env.VITEDGE_ENCODE_JWT_TOKEN;
    console.log("[claims, scret]", claims, secret);
    return jwt.sign(claims, secret, { algorithm: "HS256", expiresIn: "24h" });
}

const options = {
	clientId: process.env.VITEDGE_GOOGLE_CLIENT_ID,
	clientSecret: process.env.VITEDGE_GOOGLE_CLIENT_SECRET,
	redirectUrl: process.env.VITEDGE_GOOGLE_REDIRECT_PROD_URL,
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

export default {
	async handler({ request }) {
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
					location: '/404'
				}
			};
		}
	}
};
