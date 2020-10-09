async function user(parent, args, context, info) {
  return await context.prisma.log({ id: parent.id }).user();
}
module.exports = {
  user
};
