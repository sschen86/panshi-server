import project from '@/service/project'

export default {


  // 获取项目下的所有接口
  apis: async function get (ctx) {
    const data = await project.apis(ctx.request.query)
    ctx.body = { code: 0, data }
  },
}
