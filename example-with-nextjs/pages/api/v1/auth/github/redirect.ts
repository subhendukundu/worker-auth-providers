import { NextRequest } from "next/server";
import { github } from "worker-auth-providers";

export const config = {
  runtime: "experimental-edge",
};

export default async function (request: NextRequest) {
  const location = await github.redirect({
    options: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
    }
  });
  return new Response(
    null,
    {
      status: 302,
      headers: {
        location,
      },
    }
  )
}