
import app from '@/service/app'
import api from '@/service/api'

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
    list: {
      async dispatcher ({ query: { appId } }) {
        return api.list({ appId })
      },
    },

    detail: {
      async dispatcher ({ query: { id } }) {
        return api.detail({ id, fully: true })
      },
    },

    search: {
      async dispatcher ({ query }) {
        return api.detail(query)
      },
    },

    create: {
      method: 'post',
      async dispatcher ({ body }) {
        await api.create(body)
      },
    },

    modify: {
      method: 'post',
      async dispatcher ({ body }) {
        await api.modify(body)
      },
    },

    delete: {
      method: 'post',
      async dispatcher ({ body }) {
        await api.delete(body)
      },
    },


  },

  category: {
    list: {
      async dispatcher ({ query: { appId } }) {
        return app.category.list({ appId })
      },
    },

    create: {
      method: 'post',
      async dispatcher ({ body: { appId, name, parentId } }) {
        await app.category.create({ appId, name, parentId })
      },
    },

    delete: {
      method: 'post',
      async dispatcher ({ body: { id } }) {
        await app.category.delete({ id })
      },
    },

    move: {
      method: 'post',
      async dispatcher ({ body: { appId, targetId, selfId } }) {
        await app.category.move({ appId, targetId, selfId })
      },
    },

    modify: {
      method: 'post',
      async dispatcher ({ body: { id, name, parentId } }) {
        await app.category.modify({ id, name, parentId })
      },
    },


  },

}
