import user from '@/service/user'
import mockv from '@shushu.pro/mockv'
import md5 from 'md5'
export default {
  login: async function post (ctx) {
    const { user: userName, password } = ctx.request.body
    const data = await user.login({ userName, password })

    if (!data) {
      return ctx.body = { code: 10, message: '登录失败，请检查用户名或密码是否正确！' }
    }

    ctx.session.userId = data.id
    ctx.session.role = data.role
    ctx.body = { code: 0, message: '登录成功', data }
  },
  project: {
    list: async function get (ctx) {
      let { page = 1, pageSize = 20 } = ctx.request.query
      if (!(page >= 1)) {
        page = 1
      }
      if (pageSize > 100) {
        pageSize = 100
      }
      const list = await user.getProjects({ userId: ctx.session.userId, page, pageSize })
      ctx.body = { code: 0, data: { list, page, pageSize } }
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
  create: async function post (ctx) {
    const { name, nick } = ctx.request.body
    const password = await user.create({ name, nick: nick || name })
    ctx.body = { code: 0, data: { password } }
  },
  modify: async function post (ctx) {
    const { id, nick } = ctx.request.body
    await user.modify({ id, nick })
    ctx.body = { code: 0 }
  },
  delete: async function post (ctx) {
    const { id } = ctx.request.body
    await user.delete({ id })
    ctx.body = { code: 0 }
  },
  resetPassword: async function post (ctx) {
    const { id } = ctx.request.body
    const password = mockv.string(12)
    await user.modify({ id, password: md5(password) })
    ctx.body = { code: 0, data: { password } }
  },
  alls: async function get (ctx) {
    const data = await user.list({ page: ctx.query.page, pageSize: ctx.query.pageSize })
    ctx.body = { code: 0, data: data }
  },
  enabled: async function post (ctx) {
    const { id, enabled } = ctx.request.body
    await user.modify({ id, enabled: Number(enabled) || 0 })
    ctx.body = { code: 0 }
  },
}
