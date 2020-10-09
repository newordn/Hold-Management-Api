const info = () => `Welcome to Hold Management Api`;
async function users(parent, args, context, info) {
  console.log("users query");
  const users = await context.prisma.users({ orderBy: "id_DESC" });
  return users;
}
async function logs(parent, args, context, info) {
  console.log("logs query");
  const logs = await context.prisma.logs({ orderBy: "id_DESC" });
  return logs;
}
module.exports = {
  info,
  users,
  logs
};
