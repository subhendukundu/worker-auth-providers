import { NextRequest } from "next/server";
import * as queryString from "query-string";

export const config = {
    runtime: "experimental-edge",
};

const redirectUrl = process.env.GOOGLE_REDIRECT_PROD_URL as string;
const clientId = process.env.GOOGLE_CLIENT_ID as string;

console.log("[redirectUrl]", redirectUrl);

const params = queryString.stringify({
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: "code",
    scope: "openid email profile",
    include_granted_scopes: "true",
    state: "pass-through value",
});

const githubLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

export default async function (request: NextRequest) {
    return new Response(
        null,
        {
            status: 302,
            headers: {
                location: githubLoginUrl,
            },
        }
    )
};
