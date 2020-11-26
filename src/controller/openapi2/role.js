import role from '@/service/role'

export default {
  list: {
    async dispatcher ({ page, pageSize } = {}) {
      return role.list({ page, pageSize })
    },
  },
}
