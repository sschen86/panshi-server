import { all, get, insert, update, exec, list } from '@db'
import { remove } from 'fs-extra'


export default {


  async list ({ page, pageSize }) {
    const list = await all(`
      SELECT * FROM app
  `)
    return { list }
  },

  async detail ({ id }) {
    return get(`
        SELECT * FROM app WHERE id = ${id}
    `)
  },

  async  create ({ name, description, createUserId }) {
    await insert('app', {
      name, description, createTime: Date.now(), createUserId,
    })

    // const { projectId } = await get('SELECT last_insert_rowid() as projectId  FROM project')

    // await insert('projectFavorite', {
    //   projectId, userId,
    // })
  },

  // 修改
  async  modify ({ id, name, description }) {
    await update('app', { name, description }, `WHERE id = ${id}`)
  },

  async delete ({ id }) {
    // const { total1 } = await get(`
    //     SELECT count(*) as total1 FROM  rolePermission WHERE rolePermission.moduleFunctionId=${id}
    // `)
    // if (total1) {
    //   throw Error('权限被使用，不能删除')
    // }

    // TODO:添加删除校验，不允许删除不空的应用

    const sqlExpression = [
      'BEGIN;',
      `DELETE FROM app WHERE id=${id};`,
    ]

    sqlExpression.push('COMMIT;')
    // console.info(sqlExpression.join('\n'))
    await exec(sqlExpression.join('\n'))
  },

  user: {
    async list () {
      return list({ tableName: 'user', keys: 'id, nick' })
    },
  },

  member: {
    async list ({ id }) {
      const list = await all(`
        SELECT
          id,
          user,
          nick
        FROM
          appMember
        LEFT OUTER JOIN user ON userId = user.id
        WHERE
          appId = ${id}
      `)
      return { list }
      // return list({ tableName: 'appMember', keys: 'userId', filters: { id } })
    },


    async modify ({ appId, memberList }) {
      const sqlExpression = [
        'BEGIN;',
      ]

      if (memberList.length === 0) {
        sqlExpression.push(`
          DELETE FROM appMember WHERE appId=${appId};
        `)
      } else {
        sqlExpression.push(`
            DELETE FROM appMember WHERE userId NOT IN (${memberList.join(',')}) AND appId=${appId};
          `)
        sqlExpression.push(...memberList.map((userId) => {
          return `
              REPLACE INTO appMember (appId, userId)
              VALUES (${appId}, ${userId});
            `
        }))
      }

      sqlExpression.push('COMMIT;')
      // console.info(sqlExpression.join('\n'))

      await exec(sqlExpression.join('\n'))
    },

    async remove ({ id }) {
      await exec(`DELETE FROM appMember WHERE userId=${id};`)
    },
  },

}
