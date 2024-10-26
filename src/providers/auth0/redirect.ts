import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";
import { BaseProvider } from "../../types";

export default async function redirect({
  options,
}: BaseProvider.RedirectOptions): Promise<string> {
  const {
    clientId,
    redirectUrl,
    scope = "openid profile email",
    responseType = "code",
    state = "pass-through value",
  } = options;

  if (!clientId) {
    throw new ConfigError({
      message: "No client id passed",
    });
  }

  const params = queryString.stringify({
    client_id: clientId,
    redirect_uri: redirectUrl,
    response_type: responseType,
    scope,
    state,
  });

  const url = `https://${options.domain}/authorize?${params}`;
  return url;
}
