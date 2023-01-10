import { NextRequest } from 'next/server';
import { discord } from "worker-auth-providers";

export const config = {
  runtime: "experimental-edge",
};

export default async function (request: NextRequest) {
  const location = await discord.redirect({
    options: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      redirectUrl: process.env.DISCORD_REDIRECT_PROD_URL as string,
      scope: 'identify email',
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