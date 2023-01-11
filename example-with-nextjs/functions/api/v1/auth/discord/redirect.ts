import { discord } from "worker-auth-providers";

export const onRequestGet: PagesFunction<{ DISCORD_CLIENT_ID: string, DISCORD_REDIRECT_PROD_URL: string }> = async ({ env }) => {
  try {
    const location = await discord.redirect({
      options: {
        clientId: env.DISCORD_CLIENT_ID as string,
        redirectUrl: env.DISCORD_REDIRECT_PROD_URL as string,
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