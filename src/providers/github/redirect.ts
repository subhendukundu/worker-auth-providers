import * as queryString from "query-string";
import { ConfigError } from "../../utils/errors";

type Options = {
  clientId: string;
};

export default async function redirect({ options }: { options: Options }): Promise<string> {
  const { clientId } = options;
  if (!clientId) {
    throw new ConfigError({
      message: "No client id passed"
    });
  }
  const params = queryString.stringify({
    client_id: clientId,
    scope: ["read:user", "user:email"].join(" "),
    allow_signup: true
  });

  const githubLoginUrl = `https://github.com/login/oauth/authorize?${params}`;
  return githubLoginUrl;
}
