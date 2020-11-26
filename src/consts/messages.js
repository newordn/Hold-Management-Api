const MESSAGES = {
  signUp: (name) => `Inscription de l'utilisateur immatriculé ${name}`,
  signIn: (name) => `Connexion de l'utilisateur immatriculé ${name}`,
  hold: (name) => `Création de la soute de ${name}`,
  updateUsersHoldRole: (user, hold, role) =>
    `Mise a jour de l'utilisateur immatriculé ${user}, assignation a la soute immatriculée ${hold} avec pour role ${role}`,
  dotateHold: (
    user,
    hold,
    super_quantity,
    gazoil_quantity,
    reserve_super_quantity,
    reserve_gazoil_quantity
  ) =>
    `Dotation de l'utilisateur immatriculé ${user} a la soute immatriculée ${hold} avec les quantités super: ${super_quantity}, gasoil: ${gazoil_quantity}, reserve_super: ${reserve_super_quantity} , reserve_gasoil: ${reserve_gazoil_quantity}`,
  resetPassword: (matricule, password, newPassword) =>
    `Rénitialisation du mot de passe de l'utilisateur immatriculé ${matricule} dont l'ancien mot de passe est proche de ceci ${password} et le nouveau ${newPassword}`,
  car: (user, hold, marque, capacity, type, immatriculation, kilometrage) =>
    `L'utilisateur immatriculé ${user} effectue la création du véhicule de marque ${marque} immatriculé ${immatriculation} d'une capacité de ${capacity} consommant du ${type} qui a kilometrage de ${kilometrage} qui réside a la soute immatriculé ${hold}`,
  bon: (
    coverage_when_consuming,
    expiration_date,
    departure,
    destination,
    fuel_type,
    reason,
    initial_number_of_liter,
    user,
    holds,
    driver
  ) => `L'utilisateur immatriculé ${user} emet le bon pour du ${fuel_type} quittant de ${departure} pour ${destination} de ${initial_number_of_liter} litres 
  qui expire le ${expiration_date} avec pour motif/service ${reason} conduit par ${driver}, kilométrage lors de la consommation ${coverage_when_consuming}
  a consommé dans les soutes immatriculées ${holds}
  `
};
module.exports = {
  MESSAGES
};
