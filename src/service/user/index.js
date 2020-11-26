import { get, all, run, insert, exec, update } from '@db'
import md5 from 'md5'
import mockv from '@shushu.pro/mockv'

export default {
  async login ({ userId, password }) {
    return get(`
        SELECT id,user,role,nick FROM user WHERE user='${userId}' AND password='${md5(password)}'
    `)
  },

  async list ({ page, pageSize } = {}) {
    // 返回全部数据
    if (!pageSize) {
      return { list: await all('SELECT id, user, nick, createTime, enabled FROM user WHERE role=0') }
    }

    pageSize = Math.min(pageSize, 100)

    const { total } = await get(' SELECT count(*) as total FROM user')
    const list = total > 0 ? await all(' SELECT id, user, nick, createTime, enabled FROM user WHERE role=0') : []

    return { total, page: Number(page) || 1, pageSize, list }
  },

  role: {
    async list ({ userId }) {
      return {
        list: (await all(`
          SELECT roleId FROM userRole
          WHERE userId=${userId}
        `)).map(item => item.roleId),
      }
    },

    async modify ({ userId, roles }) {
      const sqlExpression = [
        'BEGIN;',
      ]

      if (roles.length === 0) {
        sqlExpression.push(`
              DELETE FROM userRole WHERE userId=${userId};
            `)
      } else {
        sqlExpression.push(`
            DELETE FROM userRole WHERE roleId NOT IN (${roles.join(',')}) AND userId=${userId};
          `)
        sqlExpression.push(...roles.map((roleId) => {
          return `
                INSERT INTO userRole (userId, roleId)
                VALUES (${userId}, ${roleId});
              `
        }))
      }

      sqlExpression.push('COMMIT;')
      // console.info(sqlExpression.join('\n'))
      await exec(sqlExpression.join('\n'))
    },
  },

  async create ({ user, nick = user }) {
    if (!/^\w{3,16}$/.test(user)) {
      throw Error('用户名不符合规范')
    }

    const password = mockv.string(12)
    await insert('user', {
      user, nick, password: md5(password), createTime: Date.now(),
    })

    //   if (err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.name') {
    //     throw Error('用户名已存在，请修改')
    //   }
    //   if (err.message === 'SQLITE_CONSTRAINT: UNIQUE constraint failed: user.nick') {
    //     throw Error('昵称已存在，请修改')
    //   }

    return password
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

}
