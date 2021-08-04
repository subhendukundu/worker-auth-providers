import type { ApiEndpoint } from 'vitedge'

export default <ApiEndpoint>{
  async handler() {
    return {
      data: {
        hello: 'world',
        env: import.meta.env.VITEDGE_TEST,
      },
    }
  },
}
