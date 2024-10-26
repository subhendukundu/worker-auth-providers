import { OAuthTokens } from "../../types";

export namespace Auth0 {
  export interface UserResponse {
    sub: string;
    name: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    phone_number_verified?: boolean;
    address?: {
      country?: string;
      region?: string;
      locality?: string;
      street_address?: string;
      postal_code?: string;
    };
    updated_at?: string;
  }

  export interface CallbackResponse {
    user: UserResponse;
    tokens: OAuthTokens;
  }

  export interface Auth0TokenInfoResponse {
    iss: string;
    sub: string;
    aud: string;
    iat: number;
    exp: number;
    email: string;
    email_verified: boolean;
    azp?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
    locale?: string;
    hd?: string;
  }
}
