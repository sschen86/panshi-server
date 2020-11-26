import category from '@/service/category'
export default {
  // 查询类目列表
  list: async function get (ctx) {
    const data = await category.list(ctx.request.query)
    ctx.body = { code: 0, data }
  },

  // 创建分类
  create: async function post (ctx) {
    const { projectId, name, parentId } = ctx.request.body
    await category.create({ projectId, name, parentId })
    ctx.body = { code: 0 }
  },

  // 修改分类
  modify: async function post (ctx) {
    await category.modify(ctx.request.body)
    ctx.body = { code: 0 }
  },

  // 删除分类
  delete: async function post (ctx) {
    await category.delete(ctx.request.body)
    ctx.body = { code: 0 }
  },

  // 移动分类
  move: async function post (ctx) {
    await category.move(ctx.request.body)
    ctx.body = { code: 0 }
  },
}
