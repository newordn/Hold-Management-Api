/* initialization */
const { MESSAGES } = require("../../consts/messages");
const { sendSms } = require("../../helpers/notification");
const { getUserByHoldAndRole } = require("../../helpers/user");
const { FUEL } = require("../../consts/fuels");
var generator = require("generate-password");
const { ROLES } = require("../../consts/roles");
/* initialization */
const bon = async (parent, args, context, info) => {
  const {
    type,
    reserve,
    expiration_date,
    departure,
    destination,
    fuel_type,
    reason,
    initial_number_of_liter,
    user,
    car,
    driver
  } = args;
  const getCar = await context.prisma.car({ id: car });
  const immatriculation = getCar ? getCar.immatriculation : "";
  const service = await context.prisma.user({id: args.user}).service();
  console.log(
    MESSAGES.bon(
      type,
      reserve,
      expiration_date,
      departure,
      destination,
      fuel_type,
      reason,
      initial_number_of_liter,
      user,
      immatriculation,
      driver
    )
  );
  let restant =
    fuel_type === FUEL.super
      ? service.super - initial_number_of_liter
      : service.gazoil - initial_number_of_liter;
  try {
    if (restant > 0) {
      if (fuel_type === FUEL.super) {
        await context.prisma.updateService({
          data: {
            super: restant
          },
          where: {
            id: service.id
          }
        });
      } else {
        await context.prisma.updateService({
          data: {
            gazoil: restant
          },
          where: {
            id: service.id
          }
        });
      }
      const data = car
        ? await context.prisma.createBon({
            type,
            reserve,
            service: { connect: { id: service.id } },
            coverage_when_consuming: 0,
            expiration_date,
            driver,
            fuel_type,
            destination,
            departure,
            reason,
            code: generator.generate({
              length: 10,
              numbers: true
            }),
            initial_number_of_liter,
            user: { connect: { id: user } },
            car: { connect: { id: car } },
            status: true,
            consumed: false,
            consumed_date: null,
            emission_date: new Date(),
            initial_number_of_liter,
            number_of_liter: initial_number_of_liter
          })
        : await context.prisma.createBon({
            type,
            reserve,
            service: { connect: { id: service.id } },
            coverage_when_consuming: 0,
            expiration_date,
            driver,
            fuel_type,
            destination,
            departure,
            reason,
            code: generator.generate({
              length: 10,
              numbers: true
            }),
            initial_number_of_liter,
            user: { connect: { id: user } },
            status: true,
            consumed: false,
            consumed_date: null,
            emission_date: new Date(),
            initial_number_of_liter,
            number_of_liter: initial_number_of_liter
          });
      const hold = await context.prisma.service({ id: service.id }).hold();
      await context.prisma.createHoldsOnBons({
        hold: { connect: { id: hold.id } },
        bon: { connect: { id: data.id } }
      });
      let soutierSoute = await getUserByHoldAndRole(context, hold.id, ROLES.soutier);
      sendSms(
        soutierSoute.phone,
        MESSAGES.bon(
          type,
          reserve,
          expiration_date,
          departure,
          destination,
          fuel_type,
          reason,
          initial_number_of_liter,
          user,
          immatriculation,
          driver
        ),
        soutierSoute.id,
        context
      );
      await context.prisma.createLog({
        action: MESSAGES.bon(
          type,
          reserve,
          expiration_date,
          departure,
          destination,
          fuel_type,
          reason,
          initial_number_of_liter,
          user,
          immatriculation,
          driver
        ),
        user: { connect: { id: user } }
      });

      return data;
    } else {
      throw new Error("Vous n'avez plus suffisament de bons");
    }
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

module.exports = {
  bon
};
