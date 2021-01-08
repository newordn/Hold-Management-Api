async function hold(parent, args, context, info) {
  return await context.prisma.car({ id: parent.id }).hold();
}
async function service(parent, args, context, info) {
  return await context.prisma.car({ id: parent.id }).service();
}
module.exports = {
  hold,
  service
};
