import { all, get, insert, update, exec, list } from '@db'

export default {
  async list ({ userId }) {
    const list = await all(`
        SELECT message.id, operateHistory.type, api.appId, api.name,  api.id as apiId FROM message 
        LEFT OUTER JOIN operateHistory ON message.historyId=operateHistory.id
        LEFT OUTER JOIN api ON typeId=api.id
        WHERE userId=${userId}
    `)

    // 根据apiId进行去重操作
    const apiMap = {}
    const listNext = list.filter(({ apiId }) => {
      if (apiMap[apiId]) {
        return false
      }
      apiMap[apiId] = true
      return true
    })

    return { list: listNext.reverse() }
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
