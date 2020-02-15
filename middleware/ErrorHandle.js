module.exports = (ctx, next) => {
  return next().catch((err) => {
    if (err instanceof global.HttpError) {
      ctx.status = err.code
      ctx.body = err.message
    } else {
      ctx.status = 500
      if (process.env.NODE_ENV === 'development') {
        ctx.body = err.message
      } else {
        ctx.body = 'Internal Server Error'
      }
    }
  })
}