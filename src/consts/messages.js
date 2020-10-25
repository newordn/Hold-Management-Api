const MESSAGES = {
  signUp: (name) => `Inscription de l'utilisateur immatriculé ${name}`,
  signIn: (name) => `Connexion de l'utilisateur immatriculé ${name}`,
  hold: (name)=>  `Création de la soute de ${name}`,
  updateUsersHoldRole: (user, hold, role) => `Mise a jour de l'utilisateur immatriculé ${user}, assignation a la soute ${hold} avec pour role ${role}`,
};
module.exports = {
  MESSAGES
};
