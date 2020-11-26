async function holds(parent, args, context, info) {
  const data = await context.prisma.bon({ id: parent.id }).holds()
  return data
}
async function user(parent, args, context, info){
  return await context.prisma.bon({id: parent.id}).user()
}
module.exports = {
  holds,
  user
};
