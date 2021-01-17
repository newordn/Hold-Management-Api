const suffixe ="\nandroid : https://play.google.com/store/apps/details?id=com.holdmanagementmobile\nWeb: https://bir-fuel-manager.com";
const prefixe = "Bir Fuel Manager\n";
const createMessage = (message) => `${prefixe}${message}`;
const MESSAGES = {
  signUp: (phone, password) =>
    createMessage(
      `Inscription sur BFM, veuillez vous connecter:\nNumero: ${phone},\nMot de passe: ${password} ${suffixe}`
    ),
  signIn: (name) => createMessage(`Connexion de l'utilisateur immatricule ${name}`),
  hold: (name) => createMessage(`Creation de la soute de ${name}`),
  holdLevel: (name, type, quantity) =>
    createMessage(
      `Niveau critique des cuves,la soute de ${name}, a atteint un seuil critique de ${quantity} litres en contenance ${type}`
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
      `Dotation de l'utilisateur immatricule ${responsableSoute} a l'utilisateur  ${user} avec les quantites super: ${number_of_liter_super} et gazoil: ${number_of_liter_gazoil} pour ${motif} valable du ${start_date} au ${end_date}`
    ),
  updateUsersHoldRole: (user, hold, role, name) =>
    createMessage(
      `Affectation a la soute de ${name} avec pour role ${role}`
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
      `Dotation de l'utilisateur ${user} a la soute ${hold} avec les quantites super: ${super_quantity}, gasoil: ${gazoil_quantity}, reserve_super: ${reserve_super_quantity} , reserve_gasoil: ${reserve_gazoil_quantity}  de ${start_date} a ${end_date}`
    ),
  resetPassword: (matricule, password, newPassword) =>
    createMessage(
      `Renitialisation du mot de passe de l'utilisateur ${matricule}, nouveau mot de passe:  ${newPassword} `
    ),
  car: (user, hold, marque, capacity, type, immatriculation, kilometrage, number_of_resevoir, service) =>
    createMessage(
      `L'utilisateur immatricule ${user} effectue la création du véhicule de marque ${marque} immatriculé ${immatriculation} d'une capacité de ${capacity} avec ${number_of_resevoir} réservoirs, consommant du ${type} qui a kilométrage de ${kilometrage} qui réside a la soute immatriculé ${hold}, utilisé par le service ${service}`
    ),
  service: (label,hold)=> createMessage(`Creation du service ${label}, a la soute immatriculee ${hold}`),
  bon: (
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
    holds,
    driver
  ) =>
    createMessage(`L'utilisateur immatricule ${user} emet le bon pour du ${fuel_type} ${
      reserve ? "(consommation reserve)" : "(consommation ordinaire)"
    }  ${type?" ": `quittant de ${departure} pour ${destination}`} de ${initial_number_of_liter} litres 
  qui expire le ${expiration_date} avec pour motif/service ${reason} ${type ? "": `conduit par ${driver} a consomm dans les soutes ${holds} avec la voiture  ${car}`}`),
  consumedBon: (user, bon, coverage_when_consuming, status, number_of_liter_to_consume) =>
    createMessage(
      `Consommation de ${number_of_liter_to_consume} L du bon  ${bon} par l'utilisateur ${user}, kilometrage : ${coverage_when_consuming}, ${
        status ? "reussie" : "echec"
      }`
    ),
  dotateService: (service, super_capacity, gazoil, start_date, end_date)=> createMessage(`Dotation au service ${service} de ${super_capacity} litres de super et ${gazoil} litres de gazoil, du ${start_date} et ${end_date}`),
  updateUserService: (user, service)=>  createMessage(`Affectation de l'utilisateur ${user} au service ${service}`)
};
module.exports = {
  MESSAGES
};
