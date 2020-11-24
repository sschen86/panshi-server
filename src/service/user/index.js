import { get, all, run, insert, exec, update } from '@db'
import md5 from 'md5'
import mockv from '@shushu.pro/mockv'

export default {

  async  create ({ name, nick = name }) {
    if (!/^\w{3,16}$/.test(name)) {
      throw Error('用户名不符合规范')
    }
    const password = mockv.string(12)
    try {
      await insert('user', {
        name, nick, password: md5(password), createTime: Date.now(),
      })
    } catch (err) {
      if (err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.name') {
        throw Error('用户名已存在，请修改')
      }
      if (err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.nick') {
        throw Error('昵称已存在，请修改')
      }
      throw Error(err.message)
    }

    return password
  },

  async delete ({ id }) {
    const sqlExpression = [
      'BEGIN;',
      `DELETE FROM user WHERE id=${id};`, // 删除用户
      `DELETE FROM userRole WHERE userId=${id};`, // 解除角色关联
    ]

    sqlExpression.push('COMMIT;')
    // console.info(sqlExpression.join('\n'))
    await exec(sqlExpression.join('\n'))
  },

  async  modify ({ id, nick, enabled }) {
    try {
      await update('user', { id, nick, enabled }, `WHERE id = ${id}`)
    } catch (err) {
      if (err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.nick') {
        throw Error('昵称已存在，请修改')
      }
      throw Error(err.message)
    }
  },

  async list ({ page, pageSize }) {
    pageSize = Math.min(pageSize, 100)

    const { total } = await get(`
        SELECT count(*) as total FROM user WHERE role!=2
    `)
    const list = total > 0 ? await all(`
      SELECT id, name, nick, createTime, enabled FROM user WHERE role!=2
    `) : []

    return { total, page: Number(page), pageSize, list }
  },


  async login ({ userName, password }) {
    return get(`
        SELECT id,name,role,nick FROM user WHERE name='${userName}' AND password='${md5(password)}'
    `)
  },

  async getProjects ({ userId, page, pageSize }) {
    return all(`
      SELECT * FROM projectFavorite 
        INNER JOIN project 
        ON projectFavorite.userId = ${userId} AND projectFavorite.projectId = project.id
    `)
  },

  async addFavoriteProject ({ userId, projectId }) {
    await insert('projectFavorite', {
      userId, projectId,
    })
  },

  async  removeFavoriteProject ({ userId, projectId }) {
    await run(`
        DELETE FROM projectFavorite WHERE userId = ${userId} AND projectId = ${projectId}
    `)
  },

  role: {
    async list ({ id }) {
      return (await all(`
        SELECT roleId FROM userRole
        WHERE userId=${id}
      `)).map(item => item.roleId)
    },
    async modify ({ id, roles }) {
      const sqlExpression = [
        'BEGIN;',
      ]

      if (roles.length === 0) {
        sqlExpression.push(`
          DELETE FROM userRole WHERE userId=${id};
        `)
      } else {
        sqlExpression.push(`
          DELETE FROM userRole WHERE userId NOT IN (${roles.join(',')});
        `)
        sqlExpression.push(...roles.map((roleId) => {
          return `
            INSERT INTO userRole (userId, roleId)
            VALUES (${id}, ${roleId});
          `
        }))
      }

      sqlExpression.push('COMMIT;')
      // console.info(sqlExpression.join('\n'))
      await exec(sqlExpression.join('\n'))
    },
  },
}
