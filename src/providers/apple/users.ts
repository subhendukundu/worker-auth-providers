import { importPKCS8, SignJWT, decodeJwt } from "jose";
import { BaseProvider, OAuthTokens } from "../../types";
import {
  ConfigError,
  ProviderGetUserError,
  TokenError,
} from "../../utils/errors";
import { parseQuerystring } from "../../utils/helpers";
import { logger } from "../../utils/logger";
import { Apple } from "./types";

function replaceEscapeCharacters(input: string): string {
  return input.replace(/\\n/g, "\n");
}

export async function convertPrivateKeyToClientSecret({
  privateKey,
  keyIdentifier,
  teamId,
  clientId,
  expAfter,
}: Apple.ConvertPrivateKeyToClientSecretOptions): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expAfter;

  privateKey = replaceEscapeCharacters(privateKey);

  const payload = {
    iss: teamId,
    iat: now,
    exp: now + expAfter,
    aud: "https://appleid.apple.com",
    sub: clientId,
  };

  const key = await importPKCS8(privateKey, "ES256");
  console.log(key);

  const clientSecret = await new SignJWT(payload)
    .setProtectedHeader({ alg: "ES256", kid: keyIdentifier, typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(key);

  return clientSecret;
}

export async function getTokensFromCode(
  code: string,
  { clientId, clientSecret, redirectUrl }: BaseProvider.TokensFromCodeOptions
): Promise<OAuthTokens> {
  const params = {
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
  };

  const response = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params).toString(),
  });

  const result: any = await response.json();
  logger.log(`[tokens], ${JSON.stringify(result)}`, "info");

  if (result.error) {
    throw new TokenError({
      message: result.error_description,
    });
  }
  return result as OAuthTokens;
}

export async function getUser(token: string): Promise<Apple.UserResponse> {
  try {
    const data = decodeJwt(token) as Apple.UserResponse;
    logger.log(`[provider user data], ${JSON.stringify(data)}`, "info");
    return data;
  } catch (e: any) {
    logger.log(`[error], ${JSON.stringify(e.stack)}`, "error");
    throw new ProviderGetUserError({
      message: "There was an error fetching the user",
    });
  }
}

export default async function callback({
  options,
  request,
}: BaseProvider.CallbackOptions): Promise<Apple.CallbackResponse> {
  const { query }: any = parseQuerystring(request);
  logger.setEnabled(options?.isLogEnabled || false);
  logger.log(`[code], ${JSON.stringify(query.code)}`, "info");
  if (!query.code) {
    throw new ConfigError({
      message: "No code is passed!",
    });
  }
  const tokens = await getTokensFromCode(query.code, options);
  const accessToken = tokens.access_token;
  logger.log(`[access_token], ${JSON.stringify(accessToken)}`, "info");
  const providerUser = await getUser(accessToken);
  return {
    user: providerUser,
    tokens,
  };
}
