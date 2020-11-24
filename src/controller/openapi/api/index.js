import api from '@/service/api'

export default {

  // 获取接口列表
  list: async function get (ctx) {
    const data = await api.list(ctx.request.query)
    ctx.body = { code: 0, data }
  },

  // list2: {
  //   async dispatcher ({query, body,ctx }) {
  //     return api.list({page, pageSize})
  //   },
  //   method: 'get',
  //   auth: [ 'xxx' ],
  //   requestAdapter: {

  //   },
  //   responseAdapter: {

  //   },
  // },

  // 创建接口
  create: async function post (ctx) {
    try {
      await api.create(ctx.request.body)
    } catch (err) {
      if (/UNIQUE constraint failed/i.test(err.message)) {
        return ctx.body = { code: 500, message: '接口路径已存在' }
      }
    }
    ctx.body = { code: 0 }
  },

  // 修改接口
  modify: async function post (ctx) {
    await api.modify(ctx.request.body)
    ctx.body = { code: 0 }
  },

  // 删除接口
  delete: async function post (ctx) {
    await api.delete(ctx.request.body)
    ctx.body = { code: 0 }
  },

  // 移动接口
  move: async function post (ctx) {

  },

  detail: async function get (ctx) {
    const data = await api.detail({ id: ctx.request.query.apiId, fully: true })
    ctx.body = { code: 0, data }
  },

  // 搜索接口
  search: async function get (ctx) {
    const data = await api.search(ctx.request.query)
    ctx.body = { code: 0, data }
  },

}
