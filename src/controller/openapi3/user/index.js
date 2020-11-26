

export default {


  // async list () {

  // },

  // async detail () {

  // },

  role: {
    list: {
      async dispatcher ({ session: { userId } }) {
        return { list: await user.role.list({ userId }) }
      },
    },

    // async modify () {

    // },
  },

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


  // password: {
  //   async modify () {

  //   },


  // },


}
