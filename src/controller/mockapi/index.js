// import jsonsql from '@smartx/jsonsql'
import api from '@/service/api'
import DataX from '@shushu.pro/datax'

const METHOD_NUM = { GET: 0, POST: 1, PUT: 2, DELETE: 3, OPTION: 4 }

export default {
  ':projectId/(.*)': async function all (ctx, next) {
    const method = METHOD_NUM[ctx.method]
    const { projectId, 0: path } = ctx.params

    if (!projectId) {
      return ctx.body = { code: 500, message: '接口所在项目不存在' }
    }

    const data = await api.match({ path: path, method, projectId })

    if (data === undefined) {
      ctx.body = { code: 404, message: '接口未定义' }
      return
    }

    const { resData } = data
    const { query, body, header } = ctx.request
    const responseData = DataX.parse(resData || '', { $query: query, $body: body, $header: header })

    if (responseData.$error) {
      return ctx.body = { $error: responseData.$error.message }
    }
    ctx.body = responseData
  },
  '(.*)': async function all (ctx, next) {
    ctx.body = { code: 404, message: '接口未定义' }
  },
}
