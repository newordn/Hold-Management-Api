async function user(parent, args, context, info) {
  return await context.prisma.hold({ id: parent.id }).user();
}
module.exports = {
  user
};
