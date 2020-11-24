import Router from '@koa/router'
import openapi from './openapi'
import mockapi from './mockapi'

import xiniu from '@/package/xiniu/'

const loginIgnore = [ '/openapi/user/project/list' ].map(item => {
  if (typeof item === 'string') {
    return { method: 'GET', url: item }
  } else {
    return item
  }
})

const nextRoutes = xiniu({
  baseURL: '/',
  routes: {
    openapi,
    mockapi,
  },
  request ({ ctx, route, params, session, throwError }) {
    const { method, url } = ctx.request


    // 不在登录白名单并且未登录
    if (!loginIgnore.some(item => {
      return item.method === method && item.url === url
    }) && !session.userId) {
      throwError('用户未登录', 505)
    }
  },
  response (event) {

  },
  success (event) {

  },
  failure (event) {

  },
})
// console.info({ nextRoutes })


const router = new Router({ prefix: '/' })
const TYPES = {
  CHILDREN_EXPAND: 1, // 继续展开子级
  ROUTE_ADD: 2, // 添加路由
  PATH_POP: 3, // 弹出路径
}

// loadRoutes({ openapi, mockapi })

// export default router.routes()
export default nextRoutes

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
        router[method](paths.concat(key).join('/'), catchAuth(catchError(handler), config))
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
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.log(message)

      switch (message) {
        case 'SQLITE_CONSTRAINT: UNIQUE constraint failed: module.symbol': {
          return ctx.body = { code: 500, message: '模块标识重复' }
        }
        case 'SQLITE_CONSTRAINT: UNIQUE constraint failed: module.label': {
          return ctx.body = { code: 500, message: '模块名称重复' }
        }
        case 'SQLITE_CONSTRAINT: UNIQUE constraint failed: moduleFunctionGroup.moduleId, moduleFunctionGroup.parentId, moduleFunctionGroup.symbol': {
          return ctx.body = { code: 500, message: '分组标识重复' }
        }
        case 'SQLITE_CONSTRAINT: UNIQUE constraint failed: moduleFunction.moduleId, moduleFunction.symbol': {
          return ctx.body = { code: 500, message: '权限标识重复' }
        }
      }

      if (/^SQLITE_/.test(message)) {
        ctx.body = { code: 500, message: '服务器处理异常' }
      } else {
        ctx.body = { code: 500, message }
      }
    }
  }
}

// 权限拦截器
function catchAuth (handler, config) {
  return async (ctx, next) => {
    console.info({ ctx, config })
    return handler(ctx, next)
  }
}
