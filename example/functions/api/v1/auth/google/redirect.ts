import * as queryString from "query-string";

const redirectUrl = process.env.VITEDGE_GOOGLE_REDIRECT_PROD_URL;
const clientId = process.env.VITEDGE_GOOGLE_CLIENT_ID;

console.log("[redirectUrl]", redirectUrl);

const params = queryString.stringify({
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: "code",
    scope: "openid email profile",
    include_granted_scopes: "true",
    state: "pass-through value",
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

export default {
    async handler({ request }) {
        return {
            status: 302,
            headers: {
                location: googleLoginUrl,
            },
        };
    },
};
