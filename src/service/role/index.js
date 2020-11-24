import { all, get, insert, update, exec } from '@db'

export default {

  async list ({ page, pageSize }) {
    const list = await all(`
        SELECT * FROM role
    `)
    return { page, pageSize, total: 1, list }
  },

  async  create ({ label }) {
    await insert('role', {
      label,
    })
  },

  async delete ({ id }) {
    // TODO:添加角色未被使用才能被删除的逻辑判断

    const sqlExpression = [
      'BEGIN;',
      `DELETE FROM role WHERE id=${id};`,
      `DELETE FROM rolePermission WHERE roleId=${id};`,
    ]

    sqlExpression.push('COMMIT;')

    await exec(sqlExpression.join('\n'))
  },

  async modify ({ id, label }) {
    await update('role', { label }, `WHERE id = ${id}`)
  },

  permission: {
    async list ({ id }) {
      return all(`
        SELECT * FROM rolePermission
        WHERE rolePermission.roleId=${id}
      `)
      // return all(`
      //   SELECT * FROM rolePermission
      //   LEFT OUTER JOIN role
      //   ON rolePermission.roleId=role.id
      //   WHERE rolePermission.roleId=${id}
      // `)
    },
    async modify ({ id, functionList }) {
      const deleteIds = functionList.filter(item => !item.enabled).map(item => item.id)
      const addSql = functionList.filter(item => item.enabled).map(({ id: moduleFunctionId }) => {
        return `
          INSERT INTO rolePermission (roleId, moduleFunctionId)
          VALUES (${id}, ${moduleFunctionId});
        `
      })


      const sqlExpression = [
        'BEGIN;',
      ]
      if (deleteIds.length) {
        sqlExpression.push(`DELETE FROM rolePermission WHERE moduleFunctionId IN (${deleteIds.join(', ')});`)
      }
      if (addSql) {
        sqlExpression.push(...addSql)
      }

      sqlExpression.push('COMMIT;')
      // console.info(sqlExpression.join('\n'))
      await exec(sqlExpression.join('\n'))
    },
  },
}
