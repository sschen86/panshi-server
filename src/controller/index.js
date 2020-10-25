import Router from '@koa/router'
import openapi from './openapi'
import mockapi from './mockapi'

const router = new Router({ prefix: '/' })
const TYPES = {
  CHILDREN_EXPAND: 1, // 继续展开子级
  ROUTE_ADD: 2, // 添加路由
  PATH_POP: 3, // 弹出路径
}

loadRoutes({ openapi, mockapi })

export default router.routes()

function loadRoutes (config) {
  const queue = Object.keys(config).map(key => ({ type: TYPES.CHILDREN_EXPAND, key, children: config[key] }))
  const paths = []

  while (queue.length) {
    const { type, key, children, handler, method } = queue.shift()
    switch (type) {
      case TYPES.CHILDREN_EXPAND: {
        paths.push(key)
        const nextQueueItem = Object.keys(children).map(key => {
          const item = children[key]
          if (typeof item === 'object') {
            return { type: TYPES.CHILDREN_EXPAND, key, children: item }
          }
          if (typeof item === 'function') {
            return { type: TYPES.ROUTE_ADD, key, handler: item, method: item.name }
          }
        })
        nextQueueItem.push({ type: TYPES.PATH_POP })
        queue.unshift(...nextQueueItem)
        break
      }

      case TYPES.ROUTE_ADD: {
        router[method](paths.concat(key).join('/'), catchError(handler))
        break
      }

      case TYPES.PATH_POP: {
        paths.pop()
        break
      }
    }
  }
}

// 统一错误拦截器
function catchError (handler) {
  return async (ctx, next) => {
    try {
      return await handler(ctx, next)
    } catch (err) {
      console.log(err.message)
      ctx.body = { code: 500, message: '服务器处理异常' }
    }
  }
}
