const info = () => `Welcome to Hold Management Api`;
async function users(parent, args, context, info) {
  console.log("users query");
  const users = await context.prisma.users({ orderBy: "id_DESC" });
  return users;
}
module.exports = {
  info,
  users
}