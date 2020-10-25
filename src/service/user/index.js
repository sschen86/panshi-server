import { get, all, run, insert } from '@db'
import md5 from 'md5'

export default {
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
}
