import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
import { Github } from "./types";
import { BaseProvider } from "../../types";

const DEFAULT_SCOPE = ["read:user", "user:email"];
const DEFAULT_ALLOW_SIGNUP = true;

export default async function redirect({ options }: BaseProvider.RedirectOptions): Promise<string> {
  const { clientId, redirectTo, scope = DEFAULT_SCOPE, allowSignup = DEFAULT_ALLOW_SIGNUP, state } = options;
  if (!clientId) {
    throw new ConfigError({
      message: "No client id passed"
    });
  }

  const params: Github.Params = {
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
