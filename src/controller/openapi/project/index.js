import project from '@/service/project'

export default {
  // 获取项目列表
  list: async function get (ctx) {
    const data = await project.list(ctx.request.query)
    ctx.body = { code: 0, data }
  },

  // 创建项目
  create: async function post (ctx) {
    await project.create({ ...ctx.request.body, userId: ctx.session.userId })
    ctx.body = { code: 0 }
  },

  // 查询项目详情
  detail: async function get (ctx) {
    const data = await project.detail({ projectId: ctx.query.id })
    ctx.body = { code: 0, data }
  },

  // 修改项目
  modify: async function post (ctx) {
    await project.modify(ctx.request.body)
    ctx.body = { code: 0 }
  },

  // 获取项目下的所有接口
  apis: async function get (ctx) {
    const data = await project.apis(ctx.request.query)
    ctx.body = { code: 0, data }
  },
}
