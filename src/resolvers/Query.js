const {STATISTIQUES} = require('../consts/statistique')
const {FUEL} = require('../consts/fuels')
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
  let labels = []
  let data = []
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  switch(args.type)
  {
    case STATISTIQUES.hold: 
    const holds = await context.prisma.holds({orderBy: "id_DESC"})
    holds.map(hold=>{
      labels.push(hold.name)
      data.push(hold.super_capacity)
    })
    datas.push({labels,data, label: "Super capacité"})
    data = []
    holds.map(hold=>{
      data.push(hold.gazoil_capacity)
    })
    datas.push({labels,data, label:"Gazoil capacité"})
    data = []
    holds.map(hold=>{
      data.push(hold.super_quantity)
    })
    datas.push({labels,data, label: "Contenance Super Ordinaire"})
    data = []
    holds.map(hold=>{
      data.push(hold.gazoil_quantity)
    })
    datas.push({labels,data, label: "Contenance Gasoil Ordinaire"})
    data = []
    holds.map(hold=>{
      data.push(hold.reserve_super_quantity)
    })
    datas.push({labels,data, label: "Contenance Super Réserve"})
    break;
    case STATISTIQUES.emetteur: 
    const bons = await context.prisma.user({id: args.user}).bons()
    labels.push("Bon émis", "Bon consommés", "Bon semi consommés")
    const superBons = bons.filter(bon=>bon.fuel_type===FUEL.super)
    // for bon emis
    data.push(superBons.filter(bon=>bon.consumed===false).map(bon=>bon.number_of_liter).reduce(reducer, 0.0))
    // for bon consumes
    data.push(superBons.filter(bon=>bon.consumed===true).map(bon=>bon.initial_number_of_liter).reduce(reducer, 0.0)) 
    // for bon semi consumes
    data.push(superBons.filter(bon=>bon.number_of_liter!=bon.initial_number_of_liter).map(bon=>(bon.initial_number_of_liter-bon.number_of_liter)).reduce(reducer, 0.0))
    datas.push({labels, data, label: "Super"})
    data= []
    const gazoilBons = bons.filter(bon=>bon.fuel_type===FUEL.gazoil)
    // for bon emis
    data.push(gazoilBons.filter(bon=>bon.consumed===false).map(bon=>bon.number_of_liter).reduce(reducer, 0.0))
    // for bon consumes
    data.push(gazoilBons.filter(bon=>bon.consumed===true).map(bon=>bon.initial_number_of_liter).reduce(reducer, 0.0))
     // for bon semi consumes
    data.push(gazoilBons.filter(bon=>bon.number_of_liter!=bon.initial_number_of_liter).map(bon=>(bon.initial_number_of_liter-bon.number_of_liter)).reduce(reducer, 0.0))
  
    datas.push({labels, data, label: "Gazoil"})
    break;
  }
  return datas;
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
