async function info(parent, args, context, info) {
  console.log(args.message)
  return args.message;
}
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
async function holds(parent, args, context, info) {
  console.log("holds query");
  const holds = await context.prisma.holds({ orderBy: "id_DESC" });
  return holds;
}
async function notifications(parent, args, context, info) {
  console.log("notifications query");
  const notifications = await context.prisma.notifications({ orderBy: "id_DESC" });
  return notifications;
}
async function cars(parent, args, context, info) {
  console.log("cars query");
  const data = await context.prisma.cars({ orderBy: "id_DESC" });
  return data;
}
module.exports = {
  info,
  users,
  logs,
  holds,
  notifications, 
  cars
};
