const jwt = require('jsonwebtoken')
const APP_SECRET = "HOLDMANAGEMENTAPI"

function getUserId(context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }
  throw new Error('Veuillez vous authentifiez')
}
const getUserByHoldAndRole = async (context, hold, role)=>{
const users = await context.prisma.hold({ id: hold }).users()
    return users.filter(user=>user.role===role)[0]
}

module.exports = {
  getUserId,
  APP_SECRET
}