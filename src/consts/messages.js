const suffixe = "\nMobile: https://play.google.com/store/apps/details?id=com.holdmanagementmobile\nWeb: https://bir-hold-management.com"
const prefixe = "Bir Hold Management Mobile\n"
const MESSAGES = {
  signUp: (name) => `${prefixe} Inscription de l'utilisateur immatriculé ${name}, veuillez vous connectez avec vos identifiants sur la plateforme ${suffixe}`,
  signIn: (name) => `${prefixe} Connexion de l'utilisateur immatriculé ${name}\nBir Hold Management`,
  hold: (name) => `${prefixe} Création de la soute de ${name}\nBir Hold Management`,
  holdLevel: (name,type,quantity)=> `${prefixe} Niveau critique des cuves, nous vous informons que la soute de ${name}, a atteint un seuil critique de ${quantity} litres en contenance ${type} ${suffixe}`,
  dotateEmetteur: (
    responsableSoute,
    start_date,
    end_date,
    user,
    motif,
    number_of_liter_super,
    number_of_liter_gazoil
  ) =>
    `${prefixe} Dotation de l'utilisateur immatriculé ${responsableSoute} a l'utilisateur immatriculé ${user} avec les quantités super: ${number_of_liter_super} et gazoil: ${number_of_liter_gazoil} pour ${motif} valable du ${start_date} au ${end_date} ${suffixe}`,
  updateUsersHoldRole: (user, hold, role,name) =>
    `${prefixe} Mise a jour de l'utilisateur immatriculé ${user}, assignation a la soute de ${name} immatriculée ${hold} avec pour role ${role} ${suffixe}`,
  dotateHold: (
    start_date,
    end_date,
    user,
    hold,
    super_quantity,
    gazoil_quantity,
    reserve_super_quantity,
    reserve_gazoil_quantity
  ) =>
    `${prefixe} Dotation de l'utilisateur immatriculé ${user} a la soute immatriculée ${hold} avec les quantités super: ${super_quantity}, gasoil: ${gazoil_quantity}, reserve_super: ${reserve_super_quantity} , reserve_gasoil: ${reserve_gazoil_quantity} pour une période allant de ${start_date} a ${end_date} ${suffixe}`,
  resetPassword: (matricule, password, newPassword) =>
    `${prefixe} Rénitialisation du mot de passe de l'utilisateur immatriculé ${matricule} dont l'ancien mot de passe est proche de ceci ${password} et le nouveau ${newPassword} ${suffixe}`,
  car: (user, hold, marque, capacity, type, immatriculation, kilometrage) =>
    `${prefixe} L'utilisateur immatriculé ${user} effectue la création du véhicule de marque ${marque} immatriculé ${immatriculation} d'une capacité de ${capacity} consommant du ${type} qui a kilometrage de ${kilometrage} qui réside a la soute immatriculé ${hold} ${suffixe}`,
  bon: (
    expiration_date,
    departure,
    destination,
    fuel_type,
    reason,
    initial_number_of_liter,
    user,
    car,
    holds,
    driver
  ) => `${prefixe} L'utilisateur immatriculé ${user} emet le bon pour du ${fuel_type} quittant de ${departure} pour ${destination} de ${initial_number_of_liter} litres 
  qui expire le ${expiration_date} avec pour motif/service ${reason} conduit par ${driver} a consommé dans les soutes immatriculées ${holds} avec la voiture immatriculé ${car}
  ${suffixe}`,
  consumedBon: (user, bon, coverage_when_consuming, status, number_of_liter_to_consume) =>
    `${prefixe} Consommation de ${number_of_liter_to_consume} L du bon immatriculé ${bon} par l'utilisateur immatriculé ${user}, kilométrage lors de la consommation: ${coverage_when_consuming}, ${
      status ? "reussie" : "échec"
    } ${suffixe}`
};
module.exports = {
  MESSAGES
};
