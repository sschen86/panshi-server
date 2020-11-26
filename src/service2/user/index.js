import { get, all, run, insert, exec, update } from '@db'
import md5 from 'md5'
import mockv from '@shushu.pro/mockv'

export default {


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


  },
}
