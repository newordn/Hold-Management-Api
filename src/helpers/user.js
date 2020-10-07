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
module.exports = {
  getUserId,
  APP_SECRET
}