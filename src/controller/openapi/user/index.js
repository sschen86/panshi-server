import user from '@/service/user'
export default {
  login: async function get (ctx) {
    const { user: userName, password } = ctx.request.query
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
}
