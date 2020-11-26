import app from '@/service/app'

export default {
  list: {
    async dispatcher ({ query: { page, pageSize } }) {
      return app.list({ page, pageSize })
    },
  },

  detail: {
    async dispatcher ({ query: { id } }) {
      return app.detail({ id })
    },
  },

  create: {
    method: 'post',
    async dispatcher ({ body: { name, description }, session: { userId } }) {
      await app.create({ name, description, createUserId: userId })
    },
  },

  modify: {
    method: 'post',
    async dispatcher ({ body: { id, name, description } }) {
      await app.modify({ id, name, description })
    },
  },

  delete: {
    method: 'post',
    async dispatcher ({ body: { id } }) {
      await app.delete({ id })
    },
  },

  user: {
    list: {
      async dispatcher () {
        return app.user.list()
      },
      responseData: {
        list: {
          id: 'value',
          nick: 'label',
        },
      },
    },
  },

  member: {

    list: {
      async dispatcher ({ query: { id } }) {
        return app.member.list({ id })
      },
    },


    modify: {
      method: 'post',
      async dispatcher ({ body: { appId, memberList } }) {
        await app.member.modify({ appId, memberList })
      },
    },

    add: {
      done: {
        method: 'post',
        async dispatcher () {

        },
      },
    },

    remove: {
      method: 'post',
      async dispatcher ({ body: { id } }) {
        await app.member.remove({ id })
      },
    },
  },

  api: {
    create: {
      method: 'post',
      async dispatcher () {

      },
    },
  },

}
