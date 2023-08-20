import { BaseProvider, OAuthTokens } from "../../types";

export namespace Discord {
  export interface UserResponse {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
  }

  export interface RedirectOptions extends BaseProvider.RedirectOptions {
    options: {
      prompt?: string;
      permissions?: string;
      guildId?: string;
      disableGuildSelect?: string;
    } & BaseProvider.RedirectOptions["options"];
  }

  export interface CallbackResponse {
    user: UserResponse;
    tokens: OAuthTokens;
  }
}
