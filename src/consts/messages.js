const MESSAGES = {
  signUp: (name) => `Inscription de l'utilisateur immatriculé ${name}`,
  signIn: (name) => `Connexion de l'utilisateur immatriculé ${name}`,
  hold: (name)=>  `Création de la soute de ${name}`,
  updateUsersHoldRole: (user, hold, role) => `Mise a jour de l'utilisateur immatriculé ${user}, assignation a la soute immatriculée ${hold} avec pour role ${role}`,
  dotateHold: (user, hold, super_quantity, gazoil_quantity, reserve_super_quantity, reserve_gazoil_quantity) => `Dotation de l'utilisateur immatriculé ${user} a la soute immatriculée ${hold} avec les quantités super: ${super_quantity}, gasoil: ${gazoil_quantity}, reserve_super: ${reserve_super_quantity} , reserve_gasoil: ${reserve_gazoil_quantity}`,
  resetPassword: (matricule, password, newPassword) => `Rénitialisation du mot de passe de l'utilisateur immatriculé ${matricule} dont l'ancien mot de passe est proche de ceci ${password} et le nouveau ${newPassword}`
};
module.exports = {
  MESSAGES
};
