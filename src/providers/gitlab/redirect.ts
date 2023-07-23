import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
import { Gitlab } from "./types";
import { BaseProvider } from "../../types";

const DEFAULT_SCOPE = ["read_user"];
const DEFAULT_ALLOW_SIGNUP = true;

export default async function redirect({ options }: BaseProvider.RedirectOptions): Promise<string> {
  const { clientId, redirectTo, scope = DEFAULT_SCOPE, allowSignup = DEFAULT_ALLOW_SIGNUP } = options;
  if (!clientId) {
    throw new ConfigError({
      message: "No client id passed"
    });
  }

  const params: Gitlab.Params = {
    client_id: clientId,
    scope: scope.join(" "),
    redirect_uri: redirectTo,
    response_type: "code",
    state: Math.random().toString(36).substring(7), // Generate a random state value
    allow_signup: allowSignup,
  };

  const paramString = queryString.stringify(params);
  const gitlabLoginUrl = `https://gitlab.com/oauth/authorize?${paramString}`;
  return gitlabLoginUrl;
}
