const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserByHoldAndRole } = require("../helpers/user");
const { MESSAGES } = require("../consts/messages");
const { FUEL } = require("../consts/fuels");
const { sendSms } = require("../helpers/notification");
const { parseDate } = require("../helpers/parse");
var generator = require("generate-password");

const { ROLES } = require("../consts/roles");
async function signUp(parent, args, context, info) {
  let generatePassword = generator.generate({
    length: 10,
    numbers: true
  });
  console.log(MESSAGES.signUp(args.matricule) + " avec le mot de passe " + generatePassword);
  let password = await bcrypt.hash(generatePassword, 10);
  let user = await context.prisma.createUser({
    ...args,
    password,
    super: 0,
    gazoil: 0,
    active: true
  });
  if (user) {
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    await context.prisma.createLog({
      action: MESSAGES.signUp(args.matricule),
      user: { connect: { id: user.id } }
    });
    sendSms(
      user.phone,
      MESSAGES.signUp(args.matricule) +
        " avec le mot de passe " +
        generatePassword +
        " avec le role " +
        args.role
    );
    return {
      user,
      token
    };
  }
}
async function signIn(parent, args, context, info) {
  let user = await context.prisma.user({ matricule: args.matricule });
  if (!user) {
    throw new Error("L'utilisateur n'existe pas.");
  }
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Mot de passe incorrect");
  }

  if (user) {
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    await context.prisma.createLog({
      action: MESSAGES.signIn(args.matricule),
      user: { connect: { id: user.id } }
    });
    return {
      user,
      token
    };
  }
}

async function hold(parent, args, context, info) {
  console.log(MESSAGES.hold(args.name));
  try {
    let hold = await context.prisma.createHold({
      ...args,
      super_quantity: 0,
      gazoil_quantity: 0,
      theorical_super_quantity: 0,
      theorical_gazoil_quantity: 0,
      reserve_super_quantity: 0,
      reserve_gazoil_quantity: 0,
      theorical_reserve_super_quantity: 0,
      theorical_reserve_gazoil_quantity: 0
    });
    return hold;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
async function updateUsersHoldRole(parent, args, context, info) {
  try {
    const user = await context.prisma.updateUser({
      data: { role: args.role, hold: { connect: { id: args.hold } } },
      where: { id: args.user }
    });
    10;
    const hold = await context.prisma.hold({ id: args.hold });

    await context.prisma.createLog({
      action: MESSAGES.updateUsersHoldRole(args.user, args.hold, args.role, hold.name),
      user: { connect: { id: args.user } }
    });
    console.log(MESSAGES.updateUsersHoldRole(args.user, args.hold, args.role, hold.name));
    sendSms(user.phone, MESSAGES.updateUsersHoldRole(args.user, args.hold, args.role, hold.name));
    return user;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
async function resetPassword(parent, args, context, info) {
  let generatePassword = generator.generate({
    length: 10,
    numbers: true
  });
  console.log(MESSAGES.resetPassword(args.matricule, args.password, generatePassword));
  let password1 = await bcrypt.hash(generatePassword, 10);
  try {
    const user = await context.prisma.updateUser({
      data: { password: password1 },
      where: { matricule: args.matricule }
    });
    await context.prisma.createLog({
      action: MESSAGES.resetPassword(args.matricule, args.password, generatePassword),
      user: { connect: { matricule: args.matricule } }
    });
    sendSms(user.phone, MESSAGES.resetPassword(args.matricule, args.password, generatePassword));
    return user;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
async function dotateHold(parent, args, context, info) {
  const {
    start_date,
    end_date,
    user,
    hold,
    theorical_super_quantity,
    theorical_gazoil_quantity,
    theorical_reserve_super_quantity,
    theorical_reserve_gazoil_quantity,
    motif
  } = args;
  console.log(
    MESSAGES.dotateHold(
      new Date(start_date),
      new Date(end_date),
      user,
      hold,
      theorical_super_quantity,
      theorical_gazoil_quantity,
      theorical_reserve_super_quantity,
      theorical_reserve_gazoil_quantity
    )
  );
  try {
    const hold1 = await context.prisma.hold({ id: hold });
    await context.prisma.createDotation({
      motif,
      number_of_liter_dotated_super: theorical_super_quantity,
      number_of_liter_received_super: 0,
      number_of_liter_dotated_reserve_super: theorical_reserve_super_quantity,
      number_of_liter_received_reserve_super: 0,
      number_of_liter_dotated_reserve_gazoil: theorical_reserve_super_quantity,
      number_of_liter_received_reserve_gazoil: 0,
      number_of_liter_dotated_gazoil: theorical_gazoil_quantity,
      number_of_liter_received_gazoil: 0,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      user: { connect: { id: user } },
      hold: { connect: { id: hold } }
    });
    const updateHold = await context.prisma.updateHold({
      data: {
        theorical_super_quantity: hold1.theorical_super_quantity + theorical_super_quantity,
        theorical_gazoil_quantity: hold1.theorical_gazoil_quantity + theorical_gazoil_quantity,
        theorical_reserve_super_quantity:
          hold1.theorical_reserve_super_quantity + theorical_reserve_super_quantity,
        theorical_reserve_gazoil_quantity:
          hold1.theorical_reserve_gazoil_quantity + theorical_reserve_gazoil_quantity
      },
      where: { id: hold }
    });

    await context.prisma.createLog({
      action: MESSAGES.dotateHold(
        start_date,
        end_date,
        user,
        hold,
        theorical_super_quantity,
        theorical_gazoil_quantity,
        theorical_reserve_super_quantity,
        theorical_reserve_gazoil_quantity
      ),
      user: { connect: { id: user } }
    });
    let responsableSoute = await getUserByHoldAndRole(context, hold, ROLES.responsableSoute);
    sendSms(
      responsableSoute.phone,
      MESSAGES.dotateHold(
        new Date(start_date),
        new Date(end_date),
        user,
        hold,
        theorical_super_quantity,
        theorical_gazoil_quantity,
        theorical_reserve_super_quantity,
        theorical_reserve_gazoil_quantity
      )
    );
    return updateHold;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
const car = async (parent, args, context, info) => {
  const { user, hold, marque, capacity, type, immatriculation, image, kilometrage } = args;
  console.log(MESSAGES.car(user, hold, marque, capacity, type, immatriculation, kilometrage));
  try {
    const imageUploaded = await context.storeUpload(image);
    const data = await context.prisma.createCar({
      marque,
      capacity,
      type,
      immatriculation,
      kilometrage,
      image: imageUploaded.path,
      hold: { connect: { id: hold } }
    });
    await context.prisma.createLog({
      action: MESSAGES.car(hold, marque, capacity, type, immatriculation, kilometrage),
      user: { connect: { id: user } }
    });
    return data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};
const consumedBon = async (parent, args, context, info) => {
  const { user, bon, coverage_when_consuming, code, number_of_liter_to_consume } = args;
  try {
    const getBon = await context.prisma.bon({ id: bon });
    const status = getBon.code === code;
    if (status) {
      const litre_restant = getBon.number_of_liter - number_of_liter_to_consume;
      const data = await context.prisma.updateBon({
        data: {
          consumed: litre_restant === 0 ? true : false,
          coverage_when_consuming,
          consumed_date: new Date(),
          number_of_liter: litre_restant
        },
        where: {
          id: bon
        }
      });
      await context.prisma.createLog({
        action: MESSAGES.consumedBon(
          user,
          bon,
          coverage_when_consuming,
          status,
          number_of_liter_to_consume
        ),
        user: { connect: { id: user } }
      });
      const getUser = await context.prisma.user({ id: user });
      return { message: " Bon consommé avec succès", status };
    }
    console.log(
      MESSAGES.consumedBon(user, bon, coverage_when_consuming, status, number_of_liter_to_consume)
    );

    await sendSms(
      getUser.phone,
      MESSAGES.consumedBon(user, bon, coverage_when_consuming, status, number_of_liter_to_consume)
    );
    return { message: "Code de confirmation incorrect", status };
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};
const bon = async (parent, args, context, info) => {
  const {
    expiration_date,
    departure,
    destination,
    fuel_type,
    reason,
    initial_number_of_liter,
    user,
    holds,
    car,
    driver
  } = args;
  const getCar = await context.prisma.car({ id: car });
  const emetteur = await context.prisma.user({ id: user });
  console.log(
    MESSAGES.bon(
      expiration_date,
      departure,
      destination,
      fuel_type,
      reason,
      initial_number_of_liter,
      user,
      holds,
      getCar.immatriculation,
      driver
    )
  );
  let restant =
    fuel_type === FUEL.super
      ? emetteur.super - initial_number_of_liter
      : emetteur.gazoil - initial_number_of_liter;
  try {
    if (restant > 0) {
      if (fuel_type === FUEL.super) {
        await context.prisma.updateUser({
          data: {
            super: restant
          },
          where: {
            id: user
          }
        });
      } else {
        await context.prisma.updateUser({
          data: {
            gazoil: restant
          },
          where: {
            id: user
          }
        });
      }
      const data = await context.prisma.createBon({
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
      });
      holds.map(async (hold) => {
        await context.prisma.createHoldsOnBons({
          hold: { connect: { id: hold } },
          bon: { connect: { id: data.id } }
        });
        let soutierSoute = await getUserByHoldAndRole(context, hold, ROLES.soutier);
        sendSms(
          soutierSoute.phone,
          MESSAGES.bon(
            expiration_date,
            departure,
            destination,
            fuel_type,
            reason,
            initial_number_of_liter,
            user,
            getCar.immatriculation,
            hold,
            driver
          )
        );
      });
      await context.prisma.createLog({
        action: MESSAGES.bon(
          expiration_date,
          departure,
          destination,
          fuel_type,
          reason,
          initial_number_of_liter,
          user,
          getCar.immatriculation,
          holds,
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
async function dotateEmetteur(parent, args, context, info) {
  const {
    responsableSoute,
    start_date,
    end_date,
    user,
    motif,
    number_of_liter_super,
    number_of_liter_gazoil
  } = args;
  console.log(
    MESSAGES.dotateEmetteur(
      responsableSoute,
      user,
      start_date,
      end_date,
      motif,
      number_of_liter_super,
      number_of_liter_gazoil
    )
  );
  try {
    const user1 = await context.prisma.user({ id: user });
    await context.prisma.createDotationEmetteur({
      motif,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      number_of_liter_super,
      number_of_liter_gazoil,
      user: { connect: { id: user } }
    });
    const updateUser = await context.prisma.updateUser({
      data: {
        super: user1.super + number_of_liter_super,
        gazoil: user1.gazoil + number_of_liter_gazoil
      },
      where: { id: user }
    });
    let responsableUser = await context.prisma.user({ id: responsableSoute });
    let holdId = await context.prisma.user({ id: responsableSoute }).hold();
    holdId = holdId.id;
    const hold = await context.prisma.hold({ id: holdId });
    let reste_super_quantity = hold.theorical_super_quantity - number_of_liter_super;
    let reste_gazoil_quantity = hold.theorical_gazoil_quantity - number_of_liter_gazoil;
    if (reste_super_quantity < 3000)
      sendSms(responsableUser.phone, MESSAGES.holdLevel(hold.name, "super", reste_super_quantity));
    if (reste_gazoil_quantity < 3000)
      sendSms(
        responsableUser.phone,
        MESSAGES.holdLevel(hold.name, "gazoil", reste_gazoil_quantity)
      );
    await context.prisma.updateHold({
      data: {
        theorical_super_quantity: reste_super_quantity,
        theorical_gazoil_quantity: reste_gazoil_quantity
      },
      where: { id: holdId }
    });
    await context.prisma.createLog({
      action: MESSAGES.dotateEmetteur(
        responsableSoute,
        user,
        start_date,
        end_date,
        motif,
        number_of_liter_super,
        number_of_liter_gazoil
      ),
      user: { connect: { id: responsableSoute } }
    });
    sendSms(
      user1.phone,
      MESSAGES.dotateEmetteur(
        responsableSoute,
        parseDate(new Date(start_date).toDateString()),
        parseDate(new Date(end_date).toDateString()),
        user,
        motif,
        number_of_liter_super,
        number_of_liter_gazoil
      )
    );
    return updateUser;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
module.exports = {
  signUp,
  signIn,
  hold,
  updateUsersHoldRole,
  dotateHold,
  resetPassword,
  car,
  bon,
  consumedBon,
  dotateEmetteur
};
