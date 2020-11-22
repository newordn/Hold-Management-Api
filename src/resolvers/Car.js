async function hold(parent, args, context, info) {
  return await context.prisma.car({ id: parent.id }).hold();
}
module.exports = {
  hold
};
