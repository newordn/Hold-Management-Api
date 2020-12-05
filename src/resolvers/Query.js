const {STATISTIQUES} = require('../consts/statistique')
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
async function bons(parent, args, context, info) {
  console.log("bons query");
  const data = await context.prisma.bons({ orderBy: "id_DESC", where: {consumed: args.consumed} });
  return data;
}
async function statistique(parent, args, context, info){
  console.log("statistique query " + args.type);
  const datas= []
  if(args.type===STATISTIQUES.hold){
    const holds = await context.prisma.holds({orderBy: "id_DESC"})
    let labels = []
    let data = []
    holds.map(hold=>{
      
      labels.push(hold.name)
      data.push(hold.super_capacity)
    })
    datas.push({labels,data, label: "Super capacité"})
    labels = []
    data = []
    holds.map(hold=>{
      labels.push(hold.name)
      data.push(hold.gazoil_capacity)
    })
    datas.push({labels,data, label:"Gazoil capacité"})
    labels = []
    data = []
    holds.map(hold=>{
      labels.push(hold.name)
      data.push(hold.super_quantity)
    })
    datas.push({labels,data, label: "Contenance Super Ordinaire"})
    labels = []
    data = []
    holds.map(hold=>{
      labels.push(hold.name)
      data.push(hold.gazoil_quantity)
    })
    datas.push({labels,data, label: "Contenance Gasoil Ordinaire"})
    labels = []
    data = []
    holds.map(hold=>{
      labels.push(hold.name)
      data.push(hold.reserve_super_quantity)
    })
    datas.push({labels,data, label: "Contenance Super Réserve"})
    return datas
  }
}
module.exports = {
  info,
  users,
  logs,
  holds,
  notifications, 
  cars,
  bons,
  statistique
};
