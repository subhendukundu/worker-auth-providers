import { OAuthTokens } from "../../types";

export namespace Google {
  export interface UserResponse {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
  }

  export interface CallbackResponse {
    user: UserResponse;
    tokens: OAuthTokens;
  }
}
