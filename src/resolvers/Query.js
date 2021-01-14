const {
  STATISTIQUES,
  HOLD_STATS_LABEL,
  SERVICES_LABEL,
  CARS_LABEL
} = require("../consts/statistique");
const { FUEL } = require("../consts/fuels");
const { ROLES } = require("../consts/roles");
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

carsByHold;
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
async function exporting(parent, args, context, info) {
  console.log("exporting query");
  const datas = [];
  let label = "";
  let start_date = "01/11/2020 06:00:00";
  let end_date = "01/12/2020 06:00:00";
  let link = "";
  let workbook = new excel.Workbook();
  let stream = new Stream.PassThrough();
  const fillStyle = { type: "pattern", pattern: "solid", fgColor: { argb: "969C5C" } };
  const alignmentStyle = { vertical: "middle", horizontal: "center" };
  const style = { fill: fillStyle, alignment: alignmentStyle, font: { bold: true }, size: 16 };
  let soutesSheet;
  let holds;
  let holdsNames;
  let bonsSheet;
  let bonsNames;
  let bons;
  let hold;
  let row;
  let userId = getUserId(context);
  try {
    switch (args.type) {
      case ROLES.administrateur:
        label = "Soutes";
        soutesSheet = workbook.addWorksheet(`BHM-${label}`);
        holds = await context.prisma.holds();
        holdNames = [
          { header: "Soutes", key: "Soutes", width: 15 },
          {
            header: "Localisation",
            key: "Soutes",
            width: 20
          },
          { header: "Super Capacité", key: "super_capacity", width: 20 },
          { header: "Gasoil Capacité", key: "gazoil_capacity", width: 20 },
          { header: "Quantité Super Ordinaire", key: "super_quantity", width: 25 },
          { header: "Quantité Gasoil Ordinaire", key: "gazoil_quantity", width: 25 },
          {
            header: "Quantité Théorique Super Ordinaire",
            key: "theorical_super_quantity",
            width: 30
          },
          {
            header: "Quantité Théorique Gasoil Ordinaire",
            key: "theorical_gazoil_quantity",
            width: 30
          },
          { header: "Quantité Super Réserve", key: "reserve_super_quantity", width: 25 },
          { header: "Quantité Gasoil Réserve", key: "reserve_gazoil_quantity", width: 25 },
          {
            header: "Quantité Théorique Super Réserve",
            key: "theorical_reserve_super_quantity",
            width: 30
          },
          {
            header: "Quantité Théorique Gasoil Réserve",
            key: "theorical_reserve_gazoil_quantity",
            width: 30
          }
        ];
        soutesSheet.columns = holdNames;
        row = soutesSheet.getRow(1);
        for (i = 1; i <= 12; i++) {
          row.getCell(i).style = style;
        }
        holds.map((hold, i) => {
          row = soutesSheet.getRow(i + 2);
          row.getCell(1).value = hold.name;
          row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(
            3
          ).alignment = row.getCell(4).alignment = row.getCell(5).alignment = row.getCell(
            6
          ).alignment = row.getCell(7).alignment = row.getCell(8).alignment = row.getCell(
            9
          ).alignment = row.getCell(10).alignment = row.getCell(11).alignment = row.getCell(
            12
          ).alignment = alignmentStyle;
          row.getCell(2).value = hold.localisation;
          row.getCell(3).value = hold.super_capacity;
          row.getCell(4).value = hold.gazoil_capacity;
          row.getCell(5).value = hold.super_quantity;
          row.getCell(6).value = hold.gazoil_quantity;
          row.getCell(7).value = hold.theorical_super_quantity;
          row.getCell(8).value = hold.theorical_gazoil_quantity;
          row.getCell(9).value = hold.reserve_super_quantity;
          row.getCell(10).value = hold.reserve_gazoil_quantity;
          row.getCell(11).value = hold.theorical_reserve_super_quantity;
          row.getCell(12).value = hold.theorical_reserve_gazoil_quantity;
        });
        workbook.xlsx.write(stream);
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id: "1", label, link, start_date, end_date });
        label = "Utilisateurs";
        workbook = new excel.Workbook();
        stream = new Stream.PassThrough();
        const usersSheet = workbook.addWorksheet(`BHM-${label}`);
        const users = await context.prisma.users();
        const usersName = [
          { header: "Matricule", key: "matricule", width: 15 },
          {
            header: "Noms et Prénoms",
            key: "name",
            width: 20
          },
          { header: "Login", key: "login", width: 20 },
          { header: "Grade", key: "grade", width: 20 },
          { header: "Téléphone", key: "phone", width: 20 },
          {
            header: "Rôle",
            key: "role",
            width: 20
          },
          { header: "Dotation Super (litres)", key: "super", width: 20 },
          { header: "Dotation Gazoil (litres)", key: "gazoil", width: 20 }
        ];
        usersSheet.columns = usersName;
        row = usersSheet.getRow(1);
        for (i = 1; i <= 8; i++) row.getCell(i).style = style;
        users.map((user, i) => {
          row = usersSheet.getRow(i + 2);
          row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(
            3
          ).alignment = row.getCell(4).alignment = row.getCell(5).alignment = row.getCell(
            6
          ).alignment = row.getCell(7).alignment = row.getCell(8).alignment = alignmentStyle;
          row.getCell(1).value = user.matricule;
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
        datas.push({ id: "2", label, link, start_date, end_date });
        label = "Véhicules";
        workbook = new excel.Workbook();
        stream = new Stream.PassThrough();
        const carsSheet = workbook.addWorksheet(`BHM-${label}`);
        const cars = await context.prisma.cars();
        const carsName = [
          { header: "Immatriculation", key: "immatriculation", width: 15 },
          {
            header: "Marque",
            key: "marque",
            width: 20
          },
          { header: "Contenance (litres)", key: "capacity", width: 20 },
          { header: "Kilométrage", key: "kilometrage", width: 20 },
          { header: "Type", key: "type", width: 10 }
        ];
        carsSheet.columns = carsName;
        row = carsSheet.getRow(1);
        for (i = 1; i <= 5; i++) row.getCell(i).style = style;
        cars.map((car, i) => {
          row = carsSheet.getRow(i + 2);
          row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(
            3
          ).alignment = row.getCell(4).alignment = row.getCell(5).alignment = alignmentStyle;
          row.getCell(1).value = car.immatriculation;
          row.getCell(2).value = car.marque;
          row.getCell(3).value = car.capacity;
          row.getCell(4).value = car.kilometrage;
          row.getCell(5).value = car.type;
        });
        workbook.xlsx.write(stream);
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id: "3", label, link, start_date, end_date });
        break;
      case ROLES.acheteur:
        label = "Statistiques Soutes";
        soutesSheet = workbook.addWorksheet(`BHM-${label}`);
        holds = await context.prisma.holds();
        holdNames = [
          { header: "Soutes", key: "Soutes", width: 15 },
          {
            header: "Localisation",
            key: "Soutes",
            width: 20
          },
          { header: "Super Capacité", key: "super_capacity", width: 20 },
          { header: "Gasoil Capacité", key: "gazoil_capacity", width: 20 },
          { header: "Quantité Super Ordinaire", key: "super_quantity", width: 25 },
          { header: "Quantité Gasoil Ordinaire", key: "gazoil_quantity", width: 25 },
          {
            header: "Quantité Théorique Super Ordinaire",
            key: "theorical_super_quantity",
            width: 30
          },
          {
            header: "Quantité Théorique Gasoil Ordinaire",
            key: "theorical_gazoil_quantity",
            width: 30
          },
          { header: "Quantité Super Réserve", key: "reserve_super_quantity", width: 25 },
          { header: "Quantité Gasoil Réserve", key: "reserve_gazoil_quantity", width: 25 },
          {
            header: "Quantité Théorique Super Réserve",
            key: "theorical_reserve_super_quantity",
            width: 30
          },
          {
            header: "Quantité Théorique Gasoil Réserve",
            key: "theorical_reserve_gazoil_quantity",
            width: 30
          }
        ];
        soutesSheet.columns = holdNames;
        row = soutesSheet.getRow(1);
        for (i = 1; i <= 12; i++) {
          row.getCell(i).style = style;
        }
        holds.map((hold, i) => {
          row = soutesSheet.getRow(i + 2);
          row.getCell(1).value = hold.name;
          row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(
            3
          ).alignment = row.getCell(4).alignment = row.getCell(5).alignment = row.getCell(
            6
          ).alignment = row.getCell(7).alignment = row.getCell(8).alignment = row.getCell(
            9
          ).alignment = row.getCell(10).alignment = row.getCell(11).alignment = row.getCell(
            12
          ).alignment = alignmentStyle;
          row.getCell(2).value = hold.localisation;
          row.getCell(3).value = hold.super_capacity;
          row.getCell(4).value = hold.gazoil_capacity;
          row.getCell(5).value = hold.super_quantity;
          row.getCell(6).value = hold.gazoil_quantity;
          row.getCell(7).value = hold.theorical_super_quantity;
          row.getCell(8).value = hold.theorical_gazoil_quantity;
          row.getCell(9).value = hold.reserve_super_quantity;
          row.getCell(10).value = hold.reserve_gazoil_quantity;
          row.getCell(11).value = hold.theorical_reserve_super_quantity;
          row.getCell(12).value = hold.theorical_reserve_gazoil_quantity;
        });
        workbook.xlsx.write(stream);
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id: "1", label, link, start_date, end_date });

        break;
      case ROLES.responsableSoute:
        label = "Statistiques Soute";
        soutesSheet = workbook.addWorksheet(`BHM-${label}`);
        hold = await context.prisma.user({ id: userId }).hold();
        holdNames = [
          { header: "Soute", key: "Soute", width: 15 },
          {
            header: "Localisation",
            key: "localisation",
            width: 20
          },
          { header: "Super Capacité", key: "super_capacity", width: 20 },
          { header: "Gasoil Capacité", key: "gazoil_capacity", width: 20 },
          { header: "Quantité Super Ordinaire", key: "super_quantity", width: 25 },
          { header: "Quantité Gasoil Ordinaire", key: "gazoil_quantity", width: 25 },
          { header: "Quantité Super Réserve", key: "reserve_super_quantity", width: 25 },
          { header: "Quantité Gasoil Réserve", key: "reserve_gazoil_quantity", width: 25 }
        ];
        soutesSheet.columns = holdNames;
        row = soutesSheet.getRow(1);
        for (i = 1; i <= 8; i++) {
          row.getCell(i).style = style;
        }

        row = soutesSheet.getRow(2);
        row.getCell(1).value = hold.name;
        row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(
          3
        ).alignment = row.getCell(4).alignment = row.getCell(5).alignment = row.getCell(
          6
        ).alignment = row.getCell(7).alignment = row.getCell(8).alignment = alignmentStyle;
        row.getCell(2).value = hold.localisation;
        row.getCell(3).value = hold.super_capacity;
        row.getCell(4).value = hold.gazoil_capacity;
        row.getCell(5).value = hold.super_quantity;
        row.getCell(6).value = hold.gazoil_quantity;
        row.getCell(7).value = hold.reserve_super_quantity;
        row.getCell(8).value = hold.reserve_gazoil_quantity;
        workbook.xlsx.write(stream);
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id: "2", label, link, start_date, end_date });
        break;
      case ROLES.emetteur:
        label = "Statistiques Soute";
        soutesSheet = workbook.addWorksheet(`BHM-${label}`);
        hold = await context.prisma.user({ id: userId }).hold();
        holdNames = [
          { header: "Soute", key: "Soute", width: 15 },
          {
            header: "Localisation",
            key: "localisation",
            width: 20
          },
          { header: "Super Capacité", key: "super_capacity", width: 20 },
          { header: "Gasoil Capacité", key: "gazoil_capacity", width: 20 },
          { header: "Quantité Super Ordinaire", key: "super_quantity", width: 25 },
          { header: "Quantité Gasoil Ordinaire", key: "gazoil_quantity", width: 25 },
          { header: "Quantité Super Réserve", key: "reserve_super_quantity", width: 25 },
          { header: "Quantité Gasoil Réserve", key: "reserve_gazoil_quantity", width: 25 }
        ];
        soutesSheet.columns = holdNames;
        row = soutesSheet.getRow(1);
        for (i = 1; i <= 8; i++) {
          row.getCell(i).style = style;
        }

        row = soutesSheet.getRow(2);
        row.getCell(1).value = hold.name;
        row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(
          3
        ).alignment = row.getCell(4).alignment = row.getCell(5).alignment = row.getCell(
          6
        ).alignment = row.getCell(7).alignment = row.getCell(8).alignment = alignmentStyle;
        row.getCell(2).value = hold.localisation;
        row.getCell(3).value = hold.super_capacity;
        row.getCell(4).value = hold.gazoil_capacity;
        row.getCell(5).value = hold.super_quantity;
        row.getCell(6).value = hold.gazoil_quantity;
        row.getCell(7).value = hold.reserve_super_quantity;
        row.getCell(8).value = hold.reserve_gazoil_quantity;
        workbook.xlsx.write(stream);
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id: "2", label, link, start_date, end_date });

        label = "Statistiques Bons";
        bonsSheet = workbook.addWorksheet(`BHM-${label}`);
        bons = await context.prisma.user({ id: userId }).bons();
        bonNames = [
          { header: "Départ", key: "departure", width: 20 },
          {
            header: "Destination",
            key: "destination",
            width: 20
          },
          { header: "Type d'essence", key: "fuel_type", width: 20 },
          { header: "Nombre de litre initial", key: " initial_number_of_liter", width: 20 },
          { header: "Nombre de litre après consommation", key: "number_of_liter", width: 30 },
          { header: "Véhicule", key: "car", width: 25 },
          { header: "Conducteur", key: "driver", width: 25 },
          { header: "Date d'émission", key: "emission_date", width: 25 },
          { header: "Date de consommation", key: "consumed_date", width: 25 },
          { header: "Kilométrage a la consommation", key: "coverage_when_consuming", width: 25 },
          { header: "Consommé", key: "consumed", width: 10 }
        ];
        bonsSheet.columns = bonNames;
        row = bonsSheet.getRow(1);
        for (i = 1; i <= 11; i++) {
          row.getCell(i).style = style;
        }
        await Promise.all(
          bons.map(async (bon, i) => {
            row = bonsSheet.getRow(i + 2);
            row.getCell(1).value = bon.departure;
            row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(
              3
            ).alignment = row.getCell(4).alignment = row.getCell(5).alignment = row.getCell(
              6
            ).alignment = row.getCell(7).alignment = row.getCell(8).alignment = row.getCell(
              9
            ).alignment = row.getCell(10).alignment = row.getCell(11).alignment = alignmentStyle;
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
        datas.push({ id: "1", label, link, start_date, end_date });
        break;
      case ROLES.soutier:
        label = "Statistiques Soute";
        soutesSheet = workbook.addWorksheet(`BHM-${label}`);
        hold = await context.prisma.user({ id: userId }).hold();
        holdNames = [
          { header: "Soute", key: "Soute", width: 15 },
          {
            header: "Localisation",
            key: "localisation",
            width: 20
          },
          { header: "Super Capacité", key: "super_capacity", width: 20 },
          { header: "Gasoil Capacité", key: "gazoil_capacity", width: 20 },
          { header: "Quantité Super Ordinaire", key: "super_quantity", width: 25 },
          { header: "Quantité Gasoil Ordinaire", key: "gazoil_quantity", width: 25 },
          { header: "Quantité Super Réserve", key: "reserve_super_quantity", width: 25 },
          { header: "Quantité Gasoil Réserve", key: "reserve_gazoil_quantity", width: 25 }
        ];
        soutesSheet.columns = holdNames;
        row = soutesSheet.getRow(1);
        for (i = 1; i <= 8; i++) {
          row.getCell(i).style = style;
        }

        row = soutesSheet.getRow(2);
        row.getCell(1).value = hold.name;
        row.getCell(1).alignment = row.getCell(2).alignment = row.getCell(
          3
        ).alignment = row.getCell(4).alignment = row.getCell(5).alignment = row.getCell(
          6
        ).alignment = row.getCell(7).alignment = row.getCell(8).alignment = alignmentStyle;
        row.getCell(2).value = hold.localisation;
        row.getCell(3).value = hold.super_capacity;
        row.getCell(4).value = hold.gazoil_capacity;
        row.getCell(5).value = hold.super_quantity;
        row.getCell(6).value = hold.gazoil_quantity;
        row.getCell(7).value = hold.reserve_super_quantity;
        row.getCell(8).value = hold.reserve_gazoil_quantity;
        workbook.xlsx.write(stream);
        link = await storeStreamUpload(stream, `BHM-${label}`);
        datas.push({ id: "2", label, link, start_date, end_date });
        break;
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
  return datas;
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
async function emetteurs(parent, args, context, info) {
  console.log("emetteurs by hold query");
  const users = await context.prisma.hold({ id: args.hold }).users();
  return users.filter((user) => user.role === ROLES.emetteur);
}
async function holdExporting(parent, args, context, info) {
  const datas = [];
  let label = "";
  let link = "";
  let workbook = new excel.Workbook();
  let stream = new Stream.PassThrough();
  const fillStyle = { type: "pattern", pattern: "solid", fgColor: { argb: "969C5C" } };
  const alignmentStyle = { vertical: "middle", horizontal: "center" };
  const style = { fill: fillStyle, alignment: alignmentStyle, font: { bold: true }, size: 16 };
  label = "Niveaux des cuves";
  soutesSheet = workbook.addWorksheet(`BHM-${label}`);
  hold = await context.prisma.hold({ id: args.hold });
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
  label = "Services";
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
  label = "Véhicules";
  workbook = new excel.Workbook();
  stream = new Stream.PassThrough();
  const cars = await context.prisma.hold({ id: args.hold }).cars();
  carsSheet = workbook.addWorksheet(`BHM-${label}`);
  carsSheet.columns = CARS_LABEL;
  row = servicesSheet.getRow(1);
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
  data.push(hold.super_quantity, hold.reserve_super_quantity);
  labels.push("Contenance Ordinaire", "Réserve");
  datas.push({ id: "1", labels, data, label: "Statistiques Super" });
  data = [];
  labels = [];
  data.push(hold.gazoil_quantity, hold.reserve_gazoil_quantity);
  labels.push("Contenance Ordinaire", "Réserve");
  datas.push({ id: "2", labels, data, label: "Statistiques Gasoil" });
  return datas;
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
      data.push(hold1.super_capacity, hold1.super_quantity, hold1.reserve_super_quantity);
      labels.push("Capacité", "Contenance Ordinaire", "Réserve");
      datas.push({ id: "1", labels, data, label: "Statistiques Super" });
      data = [];
      labels = [];
      data.push(hold1.gazoil_capacity, hold1.gazoil_quantity, hold1.reserve_gazoil_quantity);
      labels.push("Capacité", "Contenance Ordinaire", "Réserve");
      datas.push({ id: "1", labels, data, label: "Statistiques Gasoil" });
      break;
    case STATISTIQUES.hold:
      const holds = await context.prisma.holds({ orderBy: "id_DESC" });
      holds.map((hold) => {
        labels.push(hold.name);
        data.push(hold.super_capacity);
      });
      datas.push({ id: "1", labels, data, label: "Super capacité" });
      data = [];
      holds.map((hold) => {
        data.push(hold.gazoil_capacity);
      });
      datas.push({ id: "2", labels, data, label: "Gazoil capacité" });
      data = [];
      holds.map((hold) => {
        data.push(hold.super_quantity);
      });
      datas.push({ id: "3", labels, data, label: "Contenance Super Ordinaire" });
      data = [];
      holds.map((hold) => {
        data.push(hold.gazoil_quantity);
      });
      datas.push({ id: "4", labels, data, label: "Contenance Gasoil Ordinaire" });
      data = [];
      holds.map((hold) => {
        data.push(hold.reserve_super_quantity);
      });
      datas.push({ id: "5", labels, data, label: "Contenance Super Réserve" });
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
      datas.push({ id: "1", labels, data, label: "Super" });
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
      datas.push({ id: "2", labels, data, label: "Gazoil" });
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
      datas.push({ id: "3", labels, data, label: "Quantité restante dans les cuves" });
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
  exporting,
  usersByService,
  services,
  logsByUser,
  carsByService,
  servicesByHold,
  carsByHold,
  holdStatistiques,
  holdExporting
};
