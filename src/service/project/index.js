import { all, get, insert, update } from '@db'

export default {
  // 获取项目列表
  async list ({ page, pageSize }) {
    return all(`
        SELECT * FROM project
    `)
  },

  // 创建项目
  async  create ({ name, description, userId }) {
    await insert('project', {
      name, description, createTime: Date.now(),
    })

    const { projectId } = await get('SELECT last_insert_rowid() as projectId  FROM project')

    await insert('projectFavorite', {
      projectId, userId,
    })
  },

  // 修改
  async  modify ({ id, name, description }) {
    await update('project', { id, name, description }, `WHERE id = ${id}`)
  },

  // 项目详情
  async detail ({ projectId }) {
    return get(`
      SELECT * FROM project WHERE id = ${projectId}
    `)
  },

  async apis ({ projectId }) {
    const rs = await all(`
        SELECT id, name, categoryId, prevId, nextId FROM api WHERE projectId = ${projectId}
    `)

    const lg = rs.length
    if (lg === 0) {
      return []
    }

    // previousId 实现链表指针关联
    const map = {}
    for (let i = 0; i < lg; i++) {
      const item = rs[i]
      map[item.id] = item
    }

    rs.forEach(item => {
      item.next = map[item.nextId]
      delete map[item.nextId]
    })
    // 剩下没被使用的就是最后一个节点了
    for (const key in map) {
      const newRs = []
      let pointer = map[key]
      while (pointer) {
        newRs.push(pointer)
        const cur = pointer
        pointer = pointer.next

        // 断开链表，回收无用属性
        cur.next = undefined
        cur.prevId = undefined
        cur.nextId = undefined
      }
      return newRs
    }

    // const rs = await all(`
    //     SELECT id, name, categoryId FROM api WHERE projectId = ${projectId}
    // `)
    // return rs
  },
}
