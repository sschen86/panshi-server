import user from './user'
import permission from './permission'
// import manage from './manage'
// import role from './role'


export default {
  // 自动登录
  '(.*)': {
    method: 'all',
    loginIgnore: true,
    async dispatcher ({ ctx, next }) {
      ctx.session.userId = 1
      ctx.session.name = 'admin'
      await next()
    },
  },

  user,
  permission,

  //   manage,
  //   role,
  //   user,

  // 404拦截
  '(.*.*)': {
    method: 'all',
    loginIgnore: true,
    async dispatcher ({ throwError }) {
      throwError('接口未定义', 404)
    },
  },
}
