// import user from './user'
// import project from './project'
// import category from './category'
// import api from './api'
// import module from './module'


import manage from './manage'
import role from './role'
import user from './user'

export default {
  // 自动登录
  '(.*)': {
    method: 'all',
    async dispatcher ({ ctx, next }) {
      ctx.session.userId = 1
      ctx.session.name = 'admin'
      await next()
    },
    loginIgnore: true,
  },
  manage,
  role,
  user,

  // 404拦截
  '(.*.*)': {
    method: 'all',
    async dispatcher ({ ctx, throwError }) {
      throwError('接口未定义', 404)
    },
    loginIgnore: true,
  },
}

// export const aa = {


//   manage,

//   'test/(.*)': async function get ({ query }) {
//     return query
//   },
//   user,
//   project,
//   category,
//   api,
//   module,
//   // role,


// }
