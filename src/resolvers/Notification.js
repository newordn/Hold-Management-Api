async function user(parent, args, context, info) {
  return await context.prisma.notification({ id: parent.id }).user();
}
module.exports = {
  user
};
