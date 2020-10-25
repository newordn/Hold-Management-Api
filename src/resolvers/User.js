async function hold(parent, args, context, info) {
  return await context.prisma.user({ id: parent.id }).hold();
}
module.exports = {
  hold
};
