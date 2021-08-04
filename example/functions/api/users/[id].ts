import type { ApiEndpoint } from 'vitedge'

export default <ApiEndpoint>{
  async handler({ params }) {
    return {
      data: {
        message: `You are user "${params?.id}"`,
      },
    }
  },
}
