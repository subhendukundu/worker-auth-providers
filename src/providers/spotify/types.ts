import { OAuthTokens } from "../../types";

export namespace Spotify {
  export interface CallbackResponse {
    user: UserResponse;
    tokens: OAuthTokens;
  }

  export interface UserResponse {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
      filter_enabled: boolean;
      filter_locked: boolean;
    };
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string;
      total: number;
    };
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    product: string;
    type: string;
    uri: string;
  }
}
