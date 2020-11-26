import { get, all, run, insert, exec, update } from '@db'
import md5 from 'md5'
import mockv from '@shushu.pro/mockv'

export default {
  async login ({ userName, password }) {
    return get(`
        SELECT id,name,role,nick FROM user WHERE name='${userName}' AND password='${md5(password)}'
    `)
  },


  async detail () {

  },

  role: {


  },

  async auths () {

  },

  app: {
    async list () {

    },

    add: {
      async apply () {

      },
    },

    async remove () {

    },
  },

  project: {
    async list () {

    },
  },

  favorite: {
    api: {
      async list () {

      },
    },
  },


  password: {
    async modify () {

    },

    async reset () {

    },
  },


}
