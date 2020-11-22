import user from './user'
import project from './project'
import category from './category'
import api from './api'
import module from './module'

export default {
  '(.*)': async function all (ctx, next) {
    ctx.session.userId = 1
    ctx.session.name = 'admin'
    await next()
  },
  user,
  project,
  category,
  api,
  module,
  '(.*.*)': async function all (ctx, next) {
    ctx.body = { code: 404, message: '接口未定义' }
  },
}
