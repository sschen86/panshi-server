import fs from 'fs'
import path from 'path'

const cwd = process.cwd()
const configPath = path.resolve(cwd, 'panshirc.js')

const config = {
  dbpath: path.resolve(cwd, './db/data.db'),
  server: {
    port: 1024,
    static: path.resolve(cwd, './static'),
  },
}

if (fs.existsSync(configPath)) {
  try {
    const userConfig = require(configPath)
    const { dbpath, server } = userConfig
    if (dbpath) {
      config.dbpath = path.resolve(cwd, dbpath)
    }
    if (server && typeof server === 'object') {
      const { static: staticPath, port } = server

      if (port) {
        config.server.port = port
      }

      if (staticPath) {
        config.server.static = path.resolve(cwd, staticPath)
      }
    }
  } catch (err) {
    console.warn('panshirc.js配置错误')
  }
}

export default config
