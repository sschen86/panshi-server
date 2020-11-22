import module from '@/service/module'

export default {

  list: async function get (ctx) {
    const data = await module.list(ctx.request.query)
    ctx.body = { code: 0, data }
  },

  create: async function post (ctx) {
    const { label, symbol } = ctx.request.body
    await module.create({ label, symbol })
    ctx.body = { code: 0 }
  },

  delete: async function post (ctx) {
    const { id } = ctx.request.body
    await module.delete({ id })
    ctx.body = { code: 0 }
  },


  functionGroup: {
    list: async function get (ctx) {
      const { id } = ctx.request.query
      const data = await module.functionGroup.list({ id })
      ctx.body = { code: 0, data }
    },
    create: async function post (ctx) {
      const { moduleId, parentId, label, symbol } = ctx.request.body
      await module.functionGroup.create({ moduleId, parentId, label, symbol })
      ctx.body = { code: 0 }
    },
    delete: async function post (ctx) {
      const { id } = ctx.request.body
      await module.functionGroup.delete({ id })
      ctx.body = { code: 0 }
    },
  },

  function: {
    list: async function get (ctx) {
      const { id } = ctx.request.query
      const data = await module.function.list({ id })
      ctx.body = { code: 0, data }
    },
    create: async function post (ctx) {
      const { moduleId, groupId, label, symbol } = ctx.request.body
      await module.function.create({ moduleId, groupId, label, symbol })
      ctx.body = { code: 0 }
    },
  },


  //   // 查询项目详情
  //   detail: async function get (ctx) {
  //     const data = await project.detail({ projectId: ctx.query.id })
  //     ctx.body = { code: 0, data }
  //   },

  //   // 修改项目
  //   modify: async function post (ctx) {
  //     await project.modify(ctx.request.body)
  //     ctx.body = { code: 0 }
  //   },

//   // 获取项目下的所有接口
//   apis: async function get (ctx) {
//     const data = await project.apis(ctx.request.query)
//     ctx.body = { code: 0, data }
//   },
}
