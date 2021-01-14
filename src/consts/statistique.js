const STATISTIQUES = {
  hold: "hold",
  emetteur: "emetteur",
  responsableSoute: "responsableSoute"
};
const HOLD_STATS_LABEL = [
  { header: "Soute", key: "Soute", width: 15 },
  {
    header: "Localisation",
    key: "localisation",
    width: 20
  },
  { header: "Super Capacité", key: "super_capacity", width: 20 },
  {header: "Nombre de Cuves (Super)", key: "super_cuves_number", width: 25},
  { header: "Gasoil Capacité", key: "gazoil_capacity", width: 20 },
  {header: "Nombre de Cuves (Gasoil)", key: "gasoil_cuves_number", width: 25},
  { header: "Quantité Super Ordinaire", key: "super_quantity", width: 25 },
  { header: "Quantité Gasoil Ordinaire", key: "gazoil_quantity", width: 25 },
  { header: "Quantité Super Réserve", key: "reserve_super_quantity", width: 25 },
  { header: "Quantité Gasoil Réserve", key: "reserve_gazoil_quantity", width: 25 }
];
const SERVICES_LABEL = [
  { header: "Intitulé", key: "label", width: 25 },
  { header: "Dotation Super", key: "super", width: 25 },
  { header: "Dotation Gasoil", key: "gazoil", width: 25 },
  { header: "Soute", key: "hold", width: 25 },
];
const CARS_LABEL = [
  { header: "Marque", key: "marque", width: 25 },
  { header: "Capacité", key: "capacity", width: 25 },
  { header: "Type", key: "type", width: 25 },
  { header: "Nombre de réservoir", key: "number_of_reservoir", width: 25 },
  { header: "Immatriculation", key: "immatriculation", width: 25 },
  { header: "Kilométrage", key: "kilometrage", width: 25 },
  { header: "Soute", key: "hold", width: 25 },
];
module.exports = {
  STATISTIQUES,
  HOLD_STATS_LABEL,
  SERVICES_LABEL,
  CARS_LABEL
};
