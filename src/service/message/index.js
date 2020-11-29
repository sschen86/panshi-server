import { all, get, insert, update, exec, list } from '@db'

export default {
  async list ({ userId }) {
    const list = await all(`
        SELECT message.id, type, typeId as apiId, api.appId, api.name FROM message 
        LEFT OUTER JOIN operateHistory ON message.historyId=operateHistory.id
        LEFT OUTER JOIN api ON typeId=api.id
        WHERE userId=${userId}
    `)

    return { list: list.reverse() }
  },

  async create ({ apiId, historyId }) {
    const userIds = await all(`SELECT userId FROM favoriteApi WHERE apiId=${apiId}`)

    if (userIds.length === 0) {
      return
    }

    for (let i = 0; i < userIds.length; i++) {
      await insert('message', {
        userId: userIds[i].userId, historyId,
      })
    }
  },

  async delete ({ id, userId }) {
    await exec(`DELETE FROM message WHERE id=${id} AND userId=${userId}`)
  },
}
