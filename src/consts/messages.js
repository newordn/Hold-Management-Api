const suffixe =
  "\nLien vers l'application mobile android : https://play.google.com/store/apps/details?id=com.holdmanagementmobile\nWeb: https://bir-fuel-manager.com";
const prefixe = "Lien vers l'application web : Bir Fuel Manager Mobile\n";
const createMessage = (message) => `${prefixe}${message}${suffixe}`;
const MESSAGES = {
  transfertBon: (from, to, number_of_liter, fuel_type, motif) =>
    createMessage(
      `Transfert de l'utilisateur ${from} de ${number_of_liter} litres a l'utilisateur ${to} de ${fuel_type}, motif: ${motif}`
    ),
  signUp: (name) =>
    createMessage(
      "Inscription de l'utilisateur immatriculé ${name}, veuillez vous connectez avec vos identifiants sur la plateforme"
    ),
  signIn: (name) => createMessage(`Connexion de l'utilisateur immatriculé ${name}`),
  hold: (name) => createMessage(`Création de la soute de ${name}`),
  holdLevel: (name, type, quantity) =>
    createMessage(
      `Niveau critique des cuves, nous vous informons que la soute de ${name}, a atteint un seuil critique de ${quantity} litres en contenance ${type}`
    ),
  dotateEmetteur: (
    responsableSoute,
    start_date,
    end_date,
    user,
    motif,
    number_of_liter_super,
    number_of_liter_gazoil
  ) =>
    createMessage(
      `Dotation de l'utilisateur immatriculé ${responsableSoute} a l'utilisateur immatriculé ${user} avec les quantités super: ${number_of_liter_super} et gazoil: ${number_of_liter_gazoil} pour ${motif} valable du ${start_date} au ${end_date}`
    ),
  updateUsersHoldRole: (user, hold, role, name) =>
    createMessage(
      `Mise a jour de l'utilisateur immatriculé ${user}, assignation a la soute de ${name} immatriculée ${hold} avec pour role ${role}`
    ),
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
    createMessage(
      `Dotation de l'utilisateur immatriculé ${user} a la soute immatriculée ${hold} avec les quantités super: ${super_quantity}, gasoil: ${gazoil_quantity}, reserve_super: ${reserve_super_quantity} , reserve_gasoil: ${reserve_gazoil_quantity} pour une période allant de ${start_date} a ${end_date}`
    ),
  resetPassword: (matricule, password, newPassword) =>
    createMessage(
      `Rénitialisation du mot de passe de l'utilisateur immatriculé ${matricule} dont l'ancien mot de passe est proche de ceci ${password} et le nouveau ${newPassword} `
    ),
  car: (user, hold, marque, capacity, type, immatriculation, kilometrage) =>
    createMessage(
      `L'utilisateur immatriculé ${user} effectue la création du véhicule de marque ${marque} immatriculé ${immatriculation} d'une capacité de ${capacity} consommant du ${type} qui a kilometrage de ${kilometrage} qui réside a la soute immatriculé ${hold}`
    ),
  bon: (
    reserve,
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
  ) =>
    createMessage(`L'utilisateur immatriculé ${user} emet le bon pour du ${fuel_type} ${
      reserve ? "(consommation réserve)" : "(consommation ordinaire)"
    } quittant de ${departure} pour ${destination} de ${initial_number_of_liter} litres 
  qui expire le ${expiration_date} avec pour motif/service ${reason} conduit par ${driver} a consommé dans les soutes immatriculées ${holds} avec la voiture immatriculé ${car}`),
  consumedBon: (user, bon, coverage_when_consuming, status, number_of_liter_to_consume) =>
    createMessage(
      `Consommation de ${number_of_liter_to_consume} L du bon immatriculé ${bon} par l'utilisateur immatriculé ${user}, kilométrage lors de la consommation: ${coverage_when_consuming}, ${
        status ? "reussie" : "échec"
      }`
    )
};
module.exports = {
  MESSAGES
};
