const {
  BONS_LABEL,
  HOLD_STATS_LABEL,
  SERVICES_LABEL,
  CARS_LABEL,
  CARS_LABEL_SERVICE,
  CONSOMMATION_SERVICES_LABEL,
  USERS_LABEL
} = require("../consts/statistique");
const fillStyle = { type: "pattern", pattern: "solid", fgColor: { argb: "969C5C" } };
const alignmentStyle = { vertical: "middle", horizontal: "center" };
const style = { fill: fillStyle, alignment: alignmentStyle, font: { bold: true }, size: 16 };
const { ROLES } = require("../consts/roles");
const { FUEL } = require("../consts/fuels");
const { getUserId } = require("../helpers/user");
const excel = require("exceljs");
const { storeStreamUpload } = require("../helpers/upload");
const Stream = require("stream");
const { parseDate, addDays } = require("../helpers/parse");
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
async function usersByService(parent, args, context, info) {
  console.log("usersByService query");
  const users = await context.prisma.service({ id: args.service }).users({ orderBy: "id_DESC" });
  return users;
}
async function usersByHold(parent, args, context, info) {
  console.log("usersByHold query");
  const users = await context.prisma.hold({ id: args.hold }).users({ orderBy: "id_DESC" });
  return users;
}
async function carsByService(parent, args, context, info) {
  console.log("carsByService query");
  const cars = await context.prisma.service({ id: args.service }).cars({ orderBy: "id_DESC" });
  return cars;
}
async function servicesByHold(parent, args, context, info) {
  console.log("servicesByHold query");
  const services = await context.prisma.hold({ id: args.hold }).services({ orderBy: "id_DESC" });
  return services;
}
async function carsByHold(parent, args, context, info) {
  console.log("carsByHold query");
  const cars = await context.prisma.hold({ id: args.hold }).cars({ orderBy: "id_DESC" });
  return cars;
}

async function logsByUser(parent, args, context, info) {
  console.log("logsByUser query");
  const logs = await context.prisma.user({ id: args.user }).logs({ orderBy: "id_DESC" });
  return logs;
}

async function services(parent, args, context, info) {
  console.log("services query");
  const services = await context.prisma.services({ orderBy: "id_DESC" });
  return services;
}

async function notifications(parent, args, context, info) {
  console.log("notifications query");
  const notifications = await context.prisma.user({ id: args.user }).notifications();
  return notifications;
}
async function cars(parent, args, context, info) {
  console.log("cars query");
  const data = await context.prisma.cars({ orderBy: "id_DESC" });
  return data;
}
async function bons(parent, args, context, info) {
  console.log("bons query");
  const id = await getUserId(context);
  const data = await context.prisma.user({ id }).bons({
    orderBy: "id_DESC",
    where: { consumed: args.consumed }
  });
  return data;
}
async function bonsByHold(parent, args, context, info) {
  console.log("bonsByHold query");
  const id = await getUserId(context);
  const hold = await context.prisma.user({ id }).hold()
  const holdOnBons= await context.prisma.hold({id: hold.id}).bons()
  const datas = [] 
  await Promise.all(holdOnBons.map(async holdOnBon=>{
  let bon = await context.prisma.holdsOnBons({id: holdOnBon.id}).bon()
  datas.push(bon)
  }))
  return datas;
}

async function emetteurs(parent, args, context, info) {
  console.log("emetteurs by hold query");
  const users = await context.prisma.hold({ id: args.hold }).users();
  return users.filter((user) => user.role === ROLES.emetteur);
}
async function serviceExporting(parent, args, context, info) {
  console.log("service exporting query");
  const datas = [];
  let label = "";
  let link = "";
  let workbook = new excel.Workbook();
  let stream = new Stream.PassThrough();
  let service = await context.prisma.service({ id: args.service });
  let consommation_service_super = 0;
  let consommation_service_gazoil = 0;
  let bons = await context.prisma.service({ id: args.service }).bons();
  bons.map((bon) => {
    if (bon.fuel_type === FUEL.super) consommation_service_super += bon.number_of_liter;
    else consommation_service_gazoil += bon.number_of_liter;
  });
  label = "Consommations " + service.label;
  consommationsSheet = workbook.addWorksheet(`BHM-${label}`);
  consommationsSheet.columns = CONSOMMATION_SERVICES_LABEL;
  row = consommationsSheet.getRow(1);
  for (i = 1; i <= 5; i++) {
    row.getCell(i).style = style;
  }

  row = consommationsSheet.getRow(2);
  row.getCell(1).value = service.label;
  row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(3).alignment = row.getCell(
    4
  ).alignment = row.getCell(5).alignment = alignmentStyle;
  row.getCell(2).value = consommation_service_super;
  row.getCell(3).value = service.super;
  row.getCell(4).value = consommation_service_gazoil;
  row.getCell(5).value = service.gazoil;
  workbook.xlsx.write(stream);
  link = await storeStreamUpload(stream, `BHM-${label}`);
  let created_at = service.created_at;
  datas.push({
    id: "1",
    label,
    link,
    start_date: parseDate(created_at),
    end_date: parseDate(addDays(30, created_at).toDateString())
  });
  label = "Utilisateurs " + service.label;
  workbook = new excel.Workbook();
  stream = new Stream.PassThrough();
  const users = await context.prisma.service({ id: args.service }).users();
  usersSheet = workbook.addWorksheet(`BHM-${label}`);
  usersSheet.columns = USERS_LABEL;
  row = usersSheet.getRow(1);
  for (i = 1; i <= 8; i++) {
    row.getCell(i).style = style;
  }
  users.map((user, i) => {
    row = usersSheet.getRow(i + 2);
    row.getCell(1).value = user.matricule;
    row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(3).alignment = row.getCell(
      4
    ).alignment = row.getCell(5).alignment = row.getCell(6).alignment = row.getCell(
      7
    ).alignment = row.getCell(8).alignment = alignmentStyle;
    row.getCell(2).value = user.fullname;
    row.getCell(3).value = user.username;
    row.getCell(4).value = user.grade;
    row.getCell(5).value = user.phone;
    row.getCell(6).value = user.role;
    row.getCell(7).value = user.super;
    row.getCell(8).value = user.gazoil;
  });
  workbook.xlsx.write(stream);
  link = await storeStreamUpload(stream, `BHM-${label}`);
  datas.push({
    id: "2",
    label,
    link,
    start_date: parseDate(created_at),
    end_date: parseDate(new Date().toDateString())
  });
  label = "Véhicules " + service.label;
  workbook = new excel.Workbook();
  stream = new Stream.PassThrough();
  const cars = await context.prisma.service({ id: args.service }).cars();
  carsSheet = workbook.addWorksheet(`BHM-${label}`);
  carsSheet.columns = CARS_LABEL_SERVICE;
  row = carsSheet.getRow(1);
  for (i = 1; i <= 7; i++) {
    row.getCell(i).style = style;
  }
  cars.map((car, i) => {
    row = carsSheet.getRow(i + 2);
    row.getCell(1).value = car.marque;
    row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(3).alignment = row.getCell(
      4
    ).alignment = row.getCell(5).alignment = row.getCell(6).alignment = row.getCell(
      7
    ).alignment = alignmentStyle;
    row.getCell(2).value = car.capacity;
    row.getCell(3).value = car.type;
    row.getCell(4).value = car.number_of_reservoir;
    row.getCell(5).value = car.immatriculation;
    row.getCell(6).value = car.kilometrage;
    row.getCell(7).value = service.label;
  });
  workbook.xlsx.write(stream);
  link = await storeStreamUpload(stream, `BHM-${label}`);
  datas.push({
    id: "3",
    label,
    link,
    start_date: parseDate(created_at),
    end_date: parseDate(new Date().toDateString())
  });

  return datas;
}
async function holdExporting(parent, args, context, info) {
  const datas = [];
  let label = "";
  let link = "";
  let workbook = new excel.Workbook();
  let stream = new Stream.PassThrough();
  soutesSheet = workbook.addWorksheet(`BHM-${label}`);
  hold = await context.prisma.hold({ id: args.hold });
  label = "Niveaux des cuves " + hold.name;
  soutesSheet.columns = HOLD_STATS_LABEL;
  row = soutesSheet.getRow(1);
  for (i = 1; i <= 10; i++) {
    row.getCell(i).style = style;
  }

  row = soutesSheet.getRow(2);
  row.getCell(1).value = hold.name;
  row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(3).alignment = row.getCell(
    4
  ).alignment = row.getCell(5).alignment = row.getCell(6).alignment = row.getCell(
    7
  ).alignment = row.getCell(8).alignment = alignmentStyle;
  row.getCell(2).value = hold.localisation;
  row.getCell(3).value = hold.super_capacity;
  row.getCell(4).value = hold.super_cuves_number;
  row.getCell(5).value = hold.gazoil_capacity;
  row.getCell(6).value = hold.gazoil_cuves_number;
  row.getCell(7).value = hold.super_quantity;
  row.getCell(8).value = hold.gazoil_quantity;
  row.getCell(9).value = hold.reserve_super_quantity;
  row.getCell(10).value = hold.reserve_gazoil_quantity;
  workbook.xlsx.write(stream);
  link = await storeStreamUpload(stream, `BHM-${label}`);
  let created_at = hold.created_at;
  datas.push({
    id: "1",
    label,
    link,
    start_date: parseDate(created_at),
    end_date: parseDate(addDays(30, created_at).toDateString())
  });
  label = "Services " + hold.name;
  workbook = new excel.Workbook();
  stream = new Stream.PassThrough();
  const services = await context.prisma.hold({ id: args.hold }).services();
  servicesSheet = workbook.addWorksheet(`BHM-${label}`);
  servicesSheet.columns = SERVICES_LABEL;
  row = servicesSheet.getRow(1);
  for (i = 1; i <= 4; i++) {
    row.getCell(i).style = style;
  }
  services.map((service, i) => {
    row = servicesSheet.getRow(i + 2);
    row.getCell(1).value = service.label;
    row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(3).alignment = row.getCell(
      4
    ).alignment = alignmentStyle;
    row.getCell(2).value = service.super;
    row.getCell(3).value = service.gazoil;
    row.getCell(4).value = hold.name;
  });
  workbook.xlsx.write(stream);
  link = await storeStreamUpload(stream, `BHM-${label}`);
  datas.push({
    id: "2",
    label,
    link,
    start_date: parseDate(created_at),
    end_date: parseDate(new Date().toDateString())
  });
  label = "Véhicules " + hold.name;
  workbook = new excel.Workbook();
  stream = new Stream.PassThrough();
  const cars = await context.prisma.hold({ id: args.hold }).cars();
  carsSheet = workbook.addWorksheet(`BHM-${label}`);
  carsSheet.columns = CARS_LABEL;
  row = carsSheet.getRow(1);
  for (i = 1; i <= 7; i++) {
    row.getCell(i).style = style;
  }
  cars.map((car, i) => {
    row = carsSheet.getRow(i + 2);
    row.getCell(1).value = car.marque;
    row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(3).alignment = row.getCell(
      4
    ).alignment = row.getCell(5).alignment = row.getCell(6).alignment = row.getCell(
      7
    ).alignment = alignmentStyle;
    row.getCell(2).value = car.capacity;
    row.getCell(3).value = car.type;
    row.getCell(4).value = car.number_of_reservoir;
    row.getCell(5).value = car.immatriculation;
    row.getCell(6).value = car.kilometrage;
    row.getCell(7).value = hold.name;
  });
  workbook.xlsx.write(stream);
  link = await storeStreamUpload(stream, `BHM-${label}`);
  datas.push({
    id: "3",
    label,
    link,
    start_date: parseDate(created_at),
    end_date: parseDate(new Date().toDateString())
  });

  return datas;
}
async function holdStatistiques(parent, args, context, info) {
  const datas = [];
  let labels = [];
  let data = [];
  console.log("hold statistiques " + args.hold);
  const hold = await context.prisma.hold({ id: args.hold });
  const holdOnBons = await context.prisma.hold({ id: args.hold }).bons();
  let consommation_super = 0;
  let consommation_gazoil = 0;
  await Promise.all(
    holdOnBons.map(async (holdOnBon) => {
      let bon = await context.prisma.holdsOnBons({ id: holdOnBon.id }).bon();
      if (bon.fuel_type === FUEL.super) consommation_super += bon.number_of_liter;
      else consommation_gazoil += bon.number_of_liter;
    })
  );
  data.push(hold.super_quantity, hold.reserve_super_quantity, consommation_super);
  labels.push("Contenance Ordinaire", "Réserve", "Consommation du mois");
  datas.push({ id: "1", labels, data, label: "Statistiques Super" });
  data = [];
  labels = [];
  data.push(hold.gazoil_quantity, hold.reserve_gazoil_quantity, consommation_gazoil);
  labels.push("Contenance Ordinaire", "Réserve", "Consommation du mois");
  datas.push({ id: "2", labels, data, label: "Statistiques Gasoil" });
  data = [];
  let dataGazoil = [];
  labels = [];
  let consommation_service_super = 0;
  let consommation_service_gazoil = 0;
  const services = await context.prisma.hold({ id: args.hold }).services();
  await Promise.all(
    services.map(async (service) => {
      let bons = await context.prisma.service({ id: service.id }).bons();
      bons.map((bon) => {
        if (bon.fuel_type === FUEL.super) consommation_service_super += bon.number_of_liter;
        else consommation_service_gazoil += bon.number_of_liter;
      });
      data.push(consommation_service_super);
      dataGazoil.push(consommation_service_gazoil);
      labels.push(service.label);
    })
  );
  datas.push({ id: "3", labels, data, label: "Statistiques Services Super" });
  datas.push({ id: "4", labels, data: dataGazoil, label: "Statistiques Services Gasoil" });
  return datas;
}
async function userExporting(parent, args, context, info) {
  let label = "";
  let datas=[]
  let workbook = new excel.Workbook();
  let stream = new Stream.PassThrough();
  label = "Statistiques Bons";
  let user = await context.prisma.user({id: args.user})
  let created_at = user.created_at
  let bons = await context.prisma.user({ id: args.user }).bons();
  let bonsSheet;
  bonsSheet = workbook.addWorksheet(`BHM-${label}`);
  bonsSheet.columns = BONS_LABEL
  row = bonsSheet.getRow(1);
  for (i = 1; i <= 11; i++) {
    row.getCell(i).style = style;
  }
  await Promise.all(
    bons.map(async (bon, i) => {
      row = bonsSheet.getRow(i + 2);
      row.getCell(1).value = bon.departure;
      row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(3).alignment = row.getCell(
        4
      ).alignment = row.getCell(5).alignment = row.getCell(6).alignment = row.getCell(
        7
      ).alignment = row.getCell(8).alignment = row.getCell(9).alignment = row.getCell(
        10
      ).alignment = row.getCell(11).alignment = alignmentStyle;
      row.getCell(2).value = bon.destination;
      row.getCell(3).value = bon.fuel_type;
      row.getCell(4).value = bon.initial_number_of_liter;
      row.getCell(5).value = bon.number_of_liter;
      row.getCell(7).value = bon.driver;
      row.getCell(8).value = bon.emission_date;
      row.getCell(9).value = bon.consumed_date;
      row.getCell(10).value = bon.coverage_when_consuming;
      row.getCell(11).value = bon.consumed ? "Oui" : "Non";
      let car = await context.prisma.bon({ id: bon.id }).car();
      row.getCell(6).value = car ? car.marque + "-" + car.immatriculation : " ";
    })
  );

  workbook.xlsx.write(stream);
  link = await storeStreamUpload(stream, `BHM-${label}`);
  datas.push({ id: "1", label, link, 
    start_date: parseDate(created_at),
    end_date: parseDate(addDays(30, created_at).toDateString())});
  return datas;
}
async function userStatistiques(parent, args, context, info) {
  const datas = [];
  let labels = [];
  let data = [];
  console.log("user statistiques " + args.user);
  const user = await context.prisma.user({ id: args.user });
  const service = await context.prisma.user({ id: args.user }).service();
  if (!service) throw new Error("Utilisateur n'est pas lié a un service");
  labels.push("Emission", "Quantité restante");
  let consommation_service_super = 0;
  let consommation_service_gazoil = 0;
  let bons = await context.prisma.user({ id: args.user }).bons();
  bons.map((bon) => {
    if (bon.fuel_type === FUEL.super) consommation_service_super += bon.number_of_liter;
    else consommation_service_gazoil += bon.number_of_liter;
  });
  data.push(consommation_service_super, service.super);
  datas.push({ id: "1", labels, data, label: "Statistiques Super" });
  data = [];
  labels = [];
  labels.push("Emission", "Quantité restante");
  data.push(consommation_service_gazoil, service.gazoil);
  datas.push({ id: "2", labels, data, label: "Statistiques Gasoil" });
  return datas;
}
async function serviceStatistiques(parent, args, context, info) {
  const datas = [];
  let labels = [];
  let data = [];
  console.log("service statistiques " + args.service);
  const service = await context.prisma.service({ id: args.service });
  let consommation_service_super = 0;
  let consommation_service_gazoil = 0;
  let bons = await context.prisma.service({ id: args.service }).bons();
  bons.map((bon) => {
    if (bon.fuel_type === FUEL.super) consommation_service_super += bon.number_of_liter;
    else consommation_service_gazoil += bon.number_of_liter;
  });
  data.push(consommation_service_super, service.super);
  labels.push("Consommation", "Quantité restante");
  datas.push({ id: "1", labels, data, label: "Statistiques Super" });
  data = [];
  labels = [];
  data.push(consommation_service_gazoil, service.gazoil);
  labels.push("Consommation", "Quantité restante");
  datas.push({ id: "2", labels, data, label: "Statistiques Gasoil" });
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
  emetteurs,
  usersByService,
  services,
  logsByUser,
  carsByService,
  servicesByHold,
  carsByHold,
  holdStatistiques,
  serviceStatistiques,
  userStatistiques,
  holdExporting,
  serviceExporting,
  usersByHold,
  userExporting,
  bonsByHold
};
