import { all, get, insert, update, exec } from '@db'

export default {


  async list ({ page, pageSize }) {
    const list = await all(`
        SELECT * FROM module
    `)
    return { page, pageSize, total: 1, list }
  },


  async  create ({ label, symbol }) {
    await insert('module', {
      label, symbol,
    })
  },

  async delete ({ id }) {
    const sqlExpression = [
      'BEGIN;',
      `DELETE FROM module WHERE id=${id};`,
    ]

    sqlExpression.push('COMMIT;')

    await exec(sqlExpression.join('\n'))
  },

  functionGroup: {
    async list ({ id }) {
      const list = await all(`
        SELECT * FROM moduleFunctionGroup WHERE moduleId=${id}
      `)
      return list
    },

    async create ({ moduleId, parentId, label, symbol }) {
      await insert('moduleFunctionGroup', {
        moduleId, parentId, label, symbol,
      })
    },

    async delete ({ id }) {
      const { total1 } = await get(`
          SELECT count(*) as total1 FROM  moduleFunction WHERE moduleFunction.groupId=${id}
      `)
      if (total1) {
        throw Error('权限不为空，不能删除')
      }
      const { total2 } = await get(`
        SELECT count(*) as total2 FROM moduleFunctionGroup WHERE moduleFunctionGroup.parentId=${id}
    `)
      if (total2) {
        throw Error('分组不为空，不能删除')
      }

      const sqlExpression = [
        'BEGIN;',
        `DELETE FROM moduleFunctionGroup WHERE id=${id};`,
      ]
      sqlExpression.push('COMMIT;')
      // console.info(sqlExpression.join('\n'))
      await exec(sqlExpression.join('\n'))
    },
  },

  function: {
    async list ({ id }) {
      const list = await all(`
        SELECT * FROM moduleFunction WHERE moduleId=${id}
      `)
      return list
    },
    async create ({ moduleId, groupId, label, symbol }) {
      await insert('moduleFunction', {
        moduleId, groupId, label, symbol,
      })
    },
  },


  // async permissionTree({id}){
  //   const list = await all(`
  //     SELECT * FROM moduleFunctionGroup WHERE
  //   `)
  // }

  // // 修改
  // async  modify ({ id, name, description }) {
  //   await update('project', { id, name, description }, `WHERE id = ${id}`)
  // },

  // // 项目详情
  // async detail ({ projectId }) {
  //   return get(`
  //     SELECT * FROM project WHERE id = ${projectId}
  //   `)
  // },

  // async apis ({ projectId }) {
  //   const rs = await all(`
  //       SELECT id, name, categoryId, prevId, nextId FROM api WHERE projectId = ${projectId}
  //   `)

  //   const lg = rs.length
  //   if (lg === 0) {
  //     return []
  //   }

  //   // previousId 实现链表指针关联
  //   const map = {}
  //   for (let i = 0; i < lg; i++) {
  //     const item = rs[i]
  //     map[item.id] = item
  //   }

  //   rs.forEach(item => {
  //     item.next = map[item.nextId]
  //     delete map[item.nextId]
  //   })
  //   // 剩下没被使用的就是最后一个节点了
  //   for (const key in map) {
  //     const newRs = []
  //     let pointer = map[key]
  //     while (pointer) {
  //       newRs.push(pointer)
  //       const cur = pointer
  //       pointer = pointer.next

  //       // 断开链表，回收无用属性
  //       cur.next = undefined
  //       cur.prevId = undefined
  //       cur.nextId = undefined
  //     }
  //     return newRs
  //   }

  //   // const rs = await all(`
  //   //     SELECT id, name, categoryId FROM api WHERE projectId = ${projectId}
  //   // `)
  //   // return rs
  // },
}
