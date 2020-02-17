module.exports = (ctx, next) => {
  let auth = ctx.header.Authorization || ctx.header.authorization
  if (!auth) {
    throw new HttpError(401)
  } else {
    // ......
    Console.log(auth)
    return next()
  }
  // return next().catch((err) => {
  //   if (err instanceof global.HttpError) {
  //     ctx.status = err.code
  //     ctx.body = err.message
  //   } else {
  //     ctx.status = 500
  //     if (process.env.NODE_ENV === 'development') {
  //       ctx.body = err.message
  //     } else {
  //       ctx.body = 'Internal Server Error'
  //     }
  //   }
  // })
}