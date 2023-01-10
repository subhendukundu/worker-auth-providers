import { github } from "worker-auth-providers";

export const onRequestGet: PagesFunction<{ GITHUB_CLIENT_ID: string }> = async ({ env }) => {
  try {
    const location = await github.redirect({
      options: {
        clientId: env.GITHUB_CLIENT_ID as string,
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