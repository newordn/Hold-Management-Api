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
  console.log(MESSAGES.signIn(args.matricule));
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
async function removeUserFromHold(parent, args, context, info) {
  console.log(MESSAGES.removeUserFromHold(args.user));
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

module.exports = {
  signUp,
  signIn,
  hold,
  updateUsersHoldRole,
  removeUserFromHold
};
