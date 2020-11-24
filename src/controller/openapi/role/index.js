import role from '@/service/role'

export default {

  list: async function get (ctx) {
    const data = await role.list(ctx.request.query)
    ctx.body = { code: 0, data }
  },

  create: async function post (ctx) {
    const { label } = ctx.request.body
    await role.create({ label })
    ctx.body = { code: 0 }
  },

  delete: async function post (ctx) {
    const { id } = ctx.request.body
    await role.delete({ id })
    ctx.body = { code: 0 }
  },

  modify: async function post (ctx) {
    const { id, label } = ctx.request.body
    await role.modify({ id, label })
    ctx.body = { code: 0 }
  },

  permission: {
    list: async function get (ctx) {
      const { id } = ctx.request.query
      const data = await role.permission.list({ id })
      ctx.body = { code: 0, data }
    },
    modify: async function post (ctx) {
      const { id, functionList } = ctx.request.body
      await role.permission.modify({ id, functionList })
      ctx.body = { code: 0 }
    },
  },
}
