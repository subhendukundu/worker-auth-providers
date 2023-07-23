import { OAuthTokens } from "../../types";

export namespace Gitlab {
  export interface UserResponse {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar_url: string;
    web_url: string;
    created_at: string;
    is_admin: boolean;
    bio?: string;
    location?: string;
    public_email?: string;
    skype?: string;
    linkedin?: string;
    twitter?: string;
    website_url?: string;
    organization?: string;
  }

  export interface CallbackResponse {
    user: UserResponse;
    tokens: OAuthTokens;
  }

  export type Params = {
    client_id: string;
    redirect_uri?: string;
    scope: string;
    response_type: "code";
    state: string;
    allow_signup?: boolean;
  };
}
