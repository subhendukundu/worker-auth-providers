import { spotify } from "worker-auth-providers";

export const onRequestGet: PagesFunction<{ SPOTIFY_CLIENT_ID: string, SPOTIFY_REDIRECT_PROD_URL: string }> = async ({ env }) => {
  try {
    const location = await spotify.redirect({
      options: {
        clientId: env.SPOTIFY_CLIENT_ID as string,
        redirectUrl: env.SPOTIFY_REDIRECT_PROD_URL as string
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
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        error: 'Invalid request',
        message: `${e.message}`
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
