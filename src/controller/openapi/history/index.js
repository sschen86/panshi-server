import history from '@/service/history'

export default {
  api: {
    list: {
      async dispatcher ({ query: { apiId } }) {
        const { list } = await history.api.list({ apiId })
        return { list: list.reverse() }
      },
    },
  },
}
