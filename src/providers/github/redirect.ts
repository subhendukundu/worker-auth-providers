import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";

type Options = {
  clientId: string;
  redirectTo?: string;
  scope?: string[];
  allowSignup?: boolean;
};

type Params = {
  client_id: string;
  redirect_uri?: string;
  scope: string;
  allow_signup?: boolean;
};

const DEFAULT_SCOPE = ["read:user", "user:email"];
const DEFAULT_ALLOW_SIGNUP = true;

export default async function redirect({ options }: { options: Options }): Promise<string> {
  const { clientId, redirectTo, scope = DEFAULT_SCOPE, allowSignup = DEFAULT_ALLOW_SIGNUP } = options;
  if (!clientId) {
    throw new ConfigError({
      message: "No client id passed"
    });
  }
  const params: Params = {
    client_id: clientId,
    scope: scope.join(" "),
    allow_signup: allowSignup,
  };

  if (redirectTo) {
    params.redirect_uri = redirectTo;
  }

  const paramString = queryString.stringify(params);
  const githubLoginUrl = `https://github.com/login/oauth/authorize?${paramString}`;
  return githubLoginUrl;
}
