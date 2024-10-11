import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
const DEFAULT_SCOPE = ["read:user", "user:email"];
const DEFAULT_ALLOW_SIGNUP = true;
export default async function redirect({ options }) {
    const { clientId, redirectTo, scope = DEFAULT_SCOPE, allowSignup = DEFAULT_ALLOW_SIGNUP, state } = options;
    if (!clientId) {
        throw new ConfigError({
            message: "No client id passed"
        });
    }
    const params = {
        client_id: clientId,
        scope: scope.join(" "),
        allow_signup: allowSignup,
        state
    };
    if (redirectTo) {
        params.redirect_uri = redirectTo;
    }
    const paramString = queryString.stringify(params);
    const githubLoginUrl = `https://github.com/login/oauth/authorize?${paramString}`;
    return githubLoginUrl;
}
