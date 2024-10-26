import { auth0 } from "worker-auth-providers";

export const onRequestGet: PagesFunction<{ AUTH0_CLIENT_ID: string, AUTH0_REDIRECT_PROD_URL: string }> = async ({ env }) => {
    const redirectUrl = await auth0.redirect({
        options: {
            clientId: env.AUTH0_CLIENT_ID as string,
            redirectUrl: env.AUTH0_REDIRECT_PROD_URL as string,
        },
    });
    return Response.redirect(redirectUrl);
};
