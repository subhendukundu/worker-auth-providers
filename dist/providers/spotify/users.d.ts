import { Spotify } from "./types";
import { BaseProvider, OAuthTokens } from "../../types";
export declare function getTokensFromCode(code: string, { clientId, clientSecret, redirectUrl }: BaseProvider.TokensFromCodeOptions): Promise<OAuthTokens>;
export declare function getUser(token: string): Promise<Spotify.UserResponse>;
export default function callback({ options, request, }: BaseProvider.CallbackOptions): Promise<Spotify.CallbackResponse>;
