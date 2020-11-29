import { all, get, insert, update, exec, list } from '@db'
import message from '@/service/message'

export default {
  app: {

  },
  api: {
    async list ({ apiId, page }) {
      return list({
        tableName: 'operateHistory',
        keys: 'type, operator, createTime',
        filters: { typeId: apiId },
      })
    },
    async create ({ apiId, operator }) {
      await insert('operateHistory', {
        type: 'api.create', typeId: apiId, operator,
      })

    //   await message.create({ historyId: lastID, apiId })
      // await insert('message')
    },

    async delete ({ apiId, operator, apiData }) {
      await insert('operateHistory', {
        type: 'api.delete', typeId: apiId, operator, typeData: apiData,
      })
    },

    async modify ({ apiId, operator, apiData }) {
      const { lastID } = await insert('operateHistory', {
        type: 'api.modify', typeId: apiId, operator, typeData: apiData,
      })

      await message.create({ historyId: lastID, apiId })
    },

    async move ({ apiId, operator, apiData }) {
      const { lastID } = await insert('operateHistory', {
        type: 'api.move', typeId: apiId, operator, typeData: apiData,
      })
      await message.create({ historyId: lastID, apiId })
    },
  },
}
