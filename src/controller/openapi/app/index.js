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

  member: {
    modify: {
      method: 'post',
      async dispatcher () {

      },
    },

    add: {
      done: {
        method: 'post',
        async dispatcher () {

        },
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
