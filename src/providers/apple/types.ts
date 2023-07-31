import { OAuthTokens } from "../../types";

export namespace Apple {
  export interface UserResponse {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    name_verified?: boolean;
    given_name?: string;
    family_name?: string;
    locale?: string;
    preferred_username?: string;
    address?: {
      street_address?: string;
      locality?: string;
      region?: string;
      postal_code?: string;
      country?: string;
    };
  }

  export interface CallbackResponse {
    user: UserResponse;
    tokens: OAuthTokens;
  }

  export type Params = {
    client_id: string;
    redirect_uri?: string;
    scope: string;
    response_type: string;
    state: string;
    allow_signup?: boolean;
    response_mode?: "query" | "fragment" | "form_post";
  };

  export interface ConvertPrivateKeyToClientSecretOptions {
    privateKey: string;
    keyIdentifier: string;
    teamId: string;
    clientId: string;
    expAfter: number;
  }
}
