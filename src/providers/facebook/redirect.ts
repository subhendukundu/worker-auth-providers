import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
import { Facebook } from "./types";

export default async function redirect({
  options,
}: Facebook.RedirectOptions): Promise<string> {
  const {
    clientId,
    redirectUrl,
    redirectTo,
    scope = ["email", "user_friends"],
    responseType = "code",
    authType = "rerequest",
    display = "popup",
  } = options;
  if (!clientId) {
    throw new ConfigError({
      message: "No client id passed",
    });
  }

  if (redirectUrl && !redirectTo) {
    // If redirectUrl is provided but redirectTo is not, use redirectUrl (backward compatibility)
    console.warn(
      "The 'redirectUrl' option is deprecated. Please use 'redirectTo' instead."
    );
  }

  const usedRedirect = redirectTo || redirectUrl; // Use redirectTo if provided, else fallback to redirectUrl

  const params = queryString.stringify({
    client_id: clientId,
    redirect_uri: usedRedirect,
    scope: Array.isArray(scope) ? scope.join(" ") : scope,
    response_type: responseType,
    auth_type: authType,
    display,
  });

  const url = `https://www.facebook.com/v4.0/dialog/oauth?${params}`;
  return url;
}
