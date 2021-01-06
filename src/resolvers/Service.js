async function hold(parent, args, context, info) {
  return await context.prisma.service({ id: parent.id }).hold();
}
module.exports = {
  hold
};
