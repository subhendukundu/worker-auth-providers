import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
import { BaseProvider } from "../../types";

export default async function redirect({
  options,
}: BaseProvider.RedirectOptions): Promise<string> {
  const {
    clientId,
    redirectUrl, // Deprecated, use redirectTo instead
    redirectTo, // Use this instead of redirectUrl
    scope = "openid email profile",
    responseType = "code",
    state = "pass-through value",
    accessType = "online",
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
    response_type: responseType,
    scope,
    include_granted_scopes: "true",
    state,
    access_type: accessType,
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  return url;
}
