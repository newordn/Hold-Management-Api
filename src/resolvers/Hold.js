async function users(parent, args, context, info) {
  return await context.prisma.hold({ id: parent.id }).users();
}
module.exports = {
  users
};
