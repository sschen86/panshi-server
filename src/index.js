import RC from '../panshirc'
import Koa from 'koa'
import favicon from './koa-middleware/favicon'
import session from './koa-middleware/session'
import koaBody from './koa-middleware/koaBody'
import statics from './koa-middleware/statics'
import controller from './controller'


const app = new Koa()

app.use(favicon)
app.use(session)
app.use(koaBody)
app.use(statics)
app.use(controller)
app.listen(RC.port)
  .on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
    // eslint-disable-next-line no-console
      console.info(`端口“${RC.port}”被占用，请修改panshirc文件中的port字段然后重试`)
    }
  }).on('listening', () => {
    // eslint-disable-next-line no-console
    console.info(`server run at ${RC.port}`)
  })
