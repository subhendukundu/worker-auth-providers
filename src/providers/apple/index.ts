import { default as users, getUser, getTokensFromCode } from "./users";
import redirect from "./redirect";
import { SocialProvider } from "../../types";
export * from "./types";

export const provider = {
  users,
  getUser,
  getTokensFromCode,
  redirect,
} as SocialProvider;
