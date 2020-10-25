import send from 'koa-send'

const clientUrlRe = RegExp('^/(client)/')
const config = {
  root: `${process.cwd()}/client/styles`,
  index: 'index.html',
  maxage: 60000 * 24 * 365,
}

export default async function (ctx, next) {
  const path = ctx.path
  if (clientUrlRe.test(path)) {
    await send(ctx, path.replace(clientUrlRe, '/'), config).catch(err => {
      if (err.code === 'ENOENT' && err.status === 404) {
        ctx.status = 404
        ctx.body = 'File Not Found'
      }
    })
  } else {
    await next()
  }
}
