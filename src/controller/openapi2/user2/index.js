import user from '@/service/user'
import mockv from '@shushu.pro/mockv'
import md5 from 'md5'

export default {


  project: {
    list: async function get ({ query, ctx }) {
      let { page = 1, pageSize = 20 } = query
      if (!(page >= 1)) {
        page = 1
      }
      if (pageSize > 100) {
        pageSize = 100
      }
      const list = await user.getProjects({ userId: ctx.session.userId, page, pageSize })
      return { list, page, pageSize }
    },
  },


  favorite: {
    project: {
      add: async function post (ctx) {
        await user.addFavoriteProject({ projectId: ctx.request.body.id, userId: ctx.session.userId })
        ctx.body = { code: 0 }
      },
      remove: async function post (ctx) {
        await user.removeFavoriteProject({ projectId: ctx.request.body.id, userId: ctx.session.userId })
        ctx.body = { code: 0 }
      },
    },
  },

  modify: async function post (ctx) {
    const { id, nick } = ctx.request.body
    await user.modify({ id, nick })
    ctx.body = { code: 0 }
  },

  alls: async function get ({ ctx }) {
    const data = await user.list({ page: ctx.query.page, pageSize: ctx.query.pageSize })
    ctx.body = { code: 0, data: data }
  },
  enabled: async function post (ctx) {
    const { id, enabled } = ctx.request.body
    await user.modify({ id, enabled: Number(enabled) || 0 })
    ctx.body = { code: 0 }
  },
  role: {
    list: async function get (ctx) {
      const { id } = ctx.request.query
      const data = await user.role.list({ id })
      ctx.body = { code: 0, data }
    },
    modify: async function post (ctx) {
      const { id, roles } = ctx.request.body
      await user.role.modify({ id, roles })
      ctx.body = { code: 0 }
    },
  },
}
