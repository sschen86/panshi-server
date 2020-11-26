import mockv from '@shushu.pro/mockv'
import md5 from 'md5'
import user from '@/service/user'

export default {


  login: {
    method: 'post',
    async dispatcher ({ body, session }) {
      const { user: userId, password } = body
      const data = await user.login({ userId, password })

      if (!data) {
        throw Error('登录失败，请检查用户名或密码是否正确！')
      }

      session.userId = data.id
      session.name = data.name

      return data
    },
    loginIgnore: true,
  },

  // list: {
  //   async dispatcher () {
  //     return { list: await user.list() }
  //   },
  //   responseData: {
  //     $strict: false,
  //     list: {
  //       createTime: '#time',
  //     },
  //   },
  // },

  // async list () {

  // },

  // async detail () {

  // },

  // role: {
  //   list: {
  //     async dispatcher ({ session: { userId } }) {
  //       return { list: await user.role.list({ userId }) }
  //     },
  //   },

  //   // async modify () {

  //   // },
  // },

  // async auths () {

  // },

  // app: {
  //   async list () {

  //   },

  //   add: {
  //     async apply () {

  //     },
  //   },

  //   async remove () {

  //   },
  // },

  // project: {
  //   async list () {

  //   },
  // },

  // favorite: {
  //   api: {
  //     async list () {

  //     },
  //   },
  // },

  // create: {
  //   method: 'post',
  //   async dispatcher ({ body: { name, nick } }) {
  //     const password = await user.create({ name, nick: nick || name })
  //     return { password }
  //   },
  // },

  // modify: {
  //   method: 'post',
  //   async dispatcher ({ body: { id, nick } }) {
  //     await user.modify({ id, nick })
  //   },
  // },

  // password: {
  //   async modify () {

  //   },


  // },

  // password: {
  //   reset: {
  //     method: 'post',
  //     async dispatcher ({ body: { id } }) {
  //       const password = mockv.string(12)
  //       await user.modify({ id, password: md5(password) })
  //       return { password }
  //     },
  //   },
  // },

  // disabled: {
  //   method: 'post',
  //   async dispatcher ({ body: { id, enabled } }) {
  //     await user.modify({ id, enabled })
  //   },
  //   requestData: {
  //     id: true,
  //     state: { $key: 'enabled', $value: (state) => Number(!state) },
  //   },
  // },

  // delete: {
  //   method: 'post',
  //   async dispatcher ({ body: { id } }) {
  //     await user.delete({ id })
  //   },
  // },
}
