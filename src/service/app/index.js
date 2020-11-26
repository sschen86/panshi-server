import { all, get, insert, update, exec } from '@db'


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


}
