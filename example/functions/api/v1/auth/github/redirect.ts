import type { ApiEndpoint } from 'vitedge'
import { github } from "worker-auth-providers";

export default <ApiEndpoint>{
  async handler({ params }) {
    const location =  await github.redirect({
        options: {
            clientId: import.meta.env.VITEDGE_GITHUBCLIENT_ID,
        }
    });
    return {
        status: 302,
        headers: {
            location: location,
        },
    };
  },
}