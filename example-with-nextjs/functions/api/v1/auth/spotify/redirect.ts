import { NextRequest } from "next/server";
import { spotify } from "worker-auth-providers";

export const config = {
  runtime: "experimental-edge",
};

export default async function (request: NextRequest) {
  const location =  await spotify.redirect({
    options: {
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      redirectUrl: process.env.SPOTIFY_REDIRECT_PROD_URL as string
    }
  });
  return {
      status: 302,
      headers: {
          location: location,
      },
  };
}