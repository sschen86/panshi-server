import user from '@/service/user'

export default {
  role: {
    list: {
      async dispatcher ({ id: userId }) {
        return { list: await user.role.list({ userId }) }
      },
    },
  },
}
