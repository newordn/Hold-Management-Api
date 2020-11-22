const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../helpers/user");
const { MESSAGES } = require("../consts/messages");
var generator = require("generate-password");
async function signUp(parent, args, context, info) {
  let generatePassword = generator.generate({
    length: 10,
    numbers: true
  });
  console.log(MESSAGES.signUp(args.matricule) + " with password " + generatePassword);
  let password = await bcrypt.hash(generatePassword, 10);
  let user = await context.prisma.createUser({ ...args, password, reserve: 0 });
  if (user) {
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    await context.prisma.createLog({
      action: MESSAGES.signUp(args.matricule),
      user: { connect: { id: user.id } }
    });
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
    let hold = await context.prisma.createHold(args);
    return hold;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
async function updateUsersHoldRole(parent, args, context, info) {
  console.log(MESSAGES.updateUsersHoldRole(args.user, args.hold, args.role));
  try {
    const user = await context.prisma.updateUser({
      data: { role: args.role, hold: { connect: { id: args.hold } } },
      where: { id: args.user }
    });
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
    await context.prisma.createLog({
      action: MESSAGES.dotateHold(
        user,
        hold,
        theorical_super_quantity,
        theorical_gazoil_quantity,
        theorical_reserve_super_quantity,
        theorical_reserve_gazoil_quantity
      ),
      user: { connect: { id: user } }
    });
    return updateHold;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
const car = async (parent, args, context, info) => {
  const { user, hold, marque, capacity, type, immatriculation, image } = args;
  console.log(MESSAGES.car(user, hold, marque, capacity, type, immatriculation));
  try {
    const imageUploaded = await context.storeUpload(image);
    const data = await context.prisma.createCar({
      ...args,
      image: imageUploaded.path,
      hold: { connect: { id: hold } }
    });
    await context.prisma.createLog({
      action: MESSAGES.car(hold, marque, capacity, type, immatriculation),
      user: { connect: { matricule: args.matricule } }
    });
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
  return data;
};

module.exports = {
  signUp,
  signIn,
  hold,
  updateUsersHoldRole,
  dotateHold,
  resetPassword,
  car
};
