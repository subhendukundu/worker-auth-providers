import { BaseProvider, OAuthTokens } from "../../types";
import { Google } from "./types";
export declare function getTokensFromCode(code: string, { redirectUrl, clientId, clientSecret }: BaseProvider.TokensFromCodeOptions): Promise<OAuthTokens>;
export declare function getUser(token: string): Promise<Google.UserResponse>;
export declare function verifyIdToken(idToken: string): Promise<Google.GoogleTokenInfoResponse>;
export default function callback({ options, request, }: BaseProvider.CallbackOptions): Promise<Google.CallbackResponse>;
