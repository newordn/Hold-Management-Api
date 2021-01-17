async function holds(parent, args, context, info) {
  const data = await context.prisma.bon({ id: parent.id }).holds()
  return data
}
async function user(parent, args, context, info){
  return await context.prisma.bon({id: parent.id}).user()
}
async function car(parent, args, context, info){
  return await context.prisma.bon({id: parent.id}).car()
}
async function service(parent, args, context, info){
  return await context.prisma.bon({id: parent.id}).service()
}
module.exports = {
  holds,
  user,
  car,
  service
};
