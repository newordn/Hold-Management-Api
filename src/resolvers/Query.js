const { STATISTIQUES } = require("../consts/statistique");
const { FUEL } = require("../consts/fuels");
const { ROLES } = require("../consts/roles");
const excel = require("exceljs");
const { storeStreamUpload } = require("../helpers/upload");
const Stream = require("stream");
async function info(parent, args, context, info) {
  console.log(args.message);
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
async function exporting(parent, args, context, info) {
  console.log("exporting query");
  const datas = [];
  let label = "";
  let start_date = "01/11/2020 06:00:00";
  let end_date = "01/12/2020 06:00:00";
  let link = "";
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet(`BHM`);
  try {
    const stream = new Stream.PassThrough();
    workbook.xlsx.write(stream);

    switch (args.type) {
      case ROLES.administrateur:
        label = "Soutes";
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({id:"1", label, link, start_date, end_date });
        label = "Utilisateurs";
        datas.push({ id:"2", label, link, start_date, end_date });
        label = "Véhicules";
        datas.push({ id:"3",label, link, start_date, end_date });
        break;
      case ROLES.acheteur:
        label = "Statistiques Soutes";
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({id:"1", label, link, start_date, end_date });
        break;
      case ROLES.responsableSoute:
        label = "Statistiques Emetteurs";
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id:"1",label, link, start_date, end_date });
        label = "Statistiques Soutiers";
        datas.push({ id:"2",label, link, start_date, end_date });
        label = "Statistiques Niveaux Cuves";
        datas.push({ id:"3",label, link, start_date, end_date });
        break;
      case ROLES.emetteur:
        label = "Statistiques Bons";
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id:"1",label, link, start_date, end_date });
        label = "Statistiques Niveaux Cuves";
        datas.push({ id:"2",label, link, start_date, end_date });
        break;
      case ROLES.soutier:
        label = "Statistiques Bons";
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id:"1",label, link, start_date, end_date });
        label = "Statistiques Niveaux Cuves";
        datas.push({ id:"2",label, link, start_date, end_date });
        break;
    }
  } catch (e) {
    throw e;
  }
  return datas;
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
  const data = await context.prisma.bons({
    orderBy: "id_DESC",
    where: { consumed: args.consumed }
  });
  return data;
}
async function emetteurs(parent, args, context, info) {
  console.log("emetteurs by hold query");
  const users = await context.prisma.hold({ id: args.hold }).users();
  return users.filter((user) => user.role === ROLES.emetteur);
}
async function statistique(parent, args, context, info) {
  console.log("statistique query " + args.type);
  const datas = [];
  let labels = [];
  let data = [];
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  switch (args.type) {
    case STATISTIQUES.responsableSoute:
    const hold1 = await context.prisma.user({ id: args.user }).hold();
    data.push(hold1.super_capacity, hold1.super_quantity, hold1.reserve_super_quantity)
    labels.push("Capacité", "Contenance Ordinaire", "Réserve")
    datas.push({id:"1",labels,data, label: "Statistiques Super"})
    data=[]
    labels=[]
    data.push(hold1.gazoil_capacity, hold1.gazoil_quantity, hold1.reserve_gazoil_quantity)
    labels.push("Capacité", "Contenance Ordinaire", "Réserve")
    datas.push({id:"1",labels,data, label: "Statistiques Gasoil"})
      break;
    case STATISTIQUES.hold:
      const holds = await context.prisma.holds({ orderBy: "id_DESC" });
      holds.map((hold) => {
        labels.push(hold.name);
        data.push(hold.super_capacity);
      });
      datas.push({ id:"1",labels, data, label: "Super capacité" });
      data = [];
      holds.map((hold) => {
        data.push(hold.gazoil_capacity);
      });
      datas.push({ id:"2",labels, data, label: "Gazoil capacité" });
      data = [];
      holds.map((hold) => {
        data.push(hold.super_quantity);
      });
      datas.push({ id:"3",labels, data, label: "Contenance Super Ordinaire" });
      data = [];
      holds.map((hold) => {
        data.push(hold.gazoil_quantity);
      });
      datas.push({ id:"4",labels, data, label: "Contenance Gasoil Ordinaire" });
      data = [];
      holds.map((hold) => {
        data.push(hold.reserve_super_quantity);
      });
      datas.push({ id:"5",labels, data, label: "Contenance Super Réserve" });
      break;
    case STATISTIQUES.emetteur:
      const bons = await context.prisma.user({ id: args.user }).bons();
      labels.push("Émis", "Consommés", "Semi consommés");
      const superBons = bons.filter((bon) => bon.fuel_type === FUEL.super);
      // for bon emis
      data.push(
        superBons
          .filter((bon) => bon.consumed === false)
          .map((bon) => bon.number_of_liter)
          .reduce(reducer, 0.0)
      );
      // for bon consumes
      data.push(
        superBons
          .filter((bon) => bon.consumed === true)
          .map((bon) => bon.initial_number_of_liter)
          .reduce(reducer, 0.0)
      );
      // for bon semi consumes
      data.push(
        superBons
          .filter((bon) => bon.number_of_liter != bon.initial_number_of_liter)
          .map((bon) => bon.initial_number_of_liter - bon.number_of_liter)
          .reduce(reducer, 0.0)
      );
      datas.push({ id:"1",labels, data, label: "Super" });
      data = [];
      const gazoilBons = bons.filter((bon) => bon.fuel_type === FUEL.gazoil);
      // for bon emis
      data.push(
        gazoilBons
          .filter((bon) => bon.consumed === false)
          .map((bon) => bon.number_of_liter)
          .reduce(reducer, 0.0)
      );
      // for bon consumes
      data.push(
        gazoilBons
          .filter((bon) => bon.consumed === true)
          .map((bon) => bon.initial_number_of_liter)
          .reduce(reducer, 0.0)
      );
      // for bon semi consumes
      data.push(
        gazoilBons
          .filter((bon) => bon.number_of_liter != bon.initial_number_of_liter)
          .map((bon) => bon.initial_number_of_liter - bon.number_of_liter)
          .reduce(reducer, 0.0)
      );
      datas.push({ id:"2",labels, data, label: "Gazoil" });
      labels = [];
      data = [];
      labels.push("Super O", "Gasoil O", "Super R", "Gasoil R");
      const hold = await context.prisma.user({ id: args.user }).hold();
      console.log(hold);
      data.push(
        hold.super_quantity,
        hold.gazoil_quantity,
        hold.reserve_super_quantity,
        hold.reserve_gazoil_quantity
      );
      datas.push({ id:"3",labels, data, label: "Quantité restante dans les cuves" });
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
  statistique,
  emetteurs,
  exporting
};
