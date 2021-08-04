import type { EdgeProps } from 'vitedge'

export default <EdgeProps>{
  async handler({ params }) {
    return {
      data: {
        message: `Hello from the API, ${params?.name || 'anonymous'}`,
      },
    }
  },
  options: {
    cache: {
      html: 60 * 60 * 24 * 7,
    },
  },
}
