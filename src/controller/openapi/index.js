import user from './user'
import project from './project'
import category from './category'
import api from './api'

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
}
