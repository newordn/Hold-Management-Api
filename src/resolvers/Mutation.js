const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../helpers/user");
async function signUp(parent, args, context, info) {
  let password = await bcrypt.hash(args.password, 10)
  let user = await context.prisma.createUser({ ...args, password, reserve: 0 });
  if (user) {
    const token = jwt.sign({ userId: user.id }, APP_SECRET);
    return {
      user,
      token,
    };
  }
}
async function signIn(parent, args, context, info) {
  console.log("user signIn mutation");
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
    return {
      user,
      token,
    };
  }
}


module.exports = {
  signUp,
  signIn
}