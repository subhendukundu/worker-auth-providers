import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
import { Apple } from "./types";
import { BaseProvider } from "../../types";

export default async function redirect({
  options,
}: BaseProvider.RedirectOptions): Promise<string> {
  const {
    clientId,
    redirectTo,
    scope = [],
    state,
    responseMode = "query",
    responseType = "code"
  } = options;
  if (!clientId) {
    throw new ConfigError({
      message: "No client id passed",
    });
  }

  const params: Apple.Params = {
    client_id: clientId,
    redirect_uri: redirectTo,
    response_type: responseType,
    scope: scope.join(" "),
    state: state || Math.random().toString(36).substring(7),
    response_mode: responseMode,
  };

  const paramString = queryString.stringify(params);
  const appleLoginUrl = `https://appleid.apple.com/auth/authorize?${paramString}`;
  return appleLoginUrl;
}
