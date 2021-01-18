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
  { header: "Super Capacité(l)", key: "super_capacity", width: 20 },
  { header: "Nombre de Cuves (Super)", key: "super_cuves_number", width: 25 },
  { header: "Quantité Super Ordinaire(l)", key: "super_quantity", width: 25 },
  { header: "Quantité Super Réserve(l)", key: "reserve_super_quantity", width: 25 },
  { header: "Gasoil Capacité(l)", key: "gazoil_capacity", width: 20 },
  { header: "Nombre de Cuves (Gasoil)", key: "gasoil_cuves_number", width: 25 },
  { header: "Quantité Gasoil Ordinaire(l)", key: "gazoil_quantity", width: 25 },
  { header: "Quantité Gasoil Réserve(l)", key: "reserve_gazoil_quantity", width: 25 }
];
const SERVICES_LABEL = [
  { header: "Intitulé", key: "label", width: 25 },
  { header: "Quantité Restante Super(l)", key: "super", width: 25 },
  { header: "Quantité Restante Gasoil(l)", key: "gazoil", width: 25 },
  { header: "Soute", key: "hold", width: 25 }
];
const CONSOMMATION_SERVICES_LABEL = [
  { header: "Intitulé", key: "label", width: 25 },
  { header: "Consommation Super(l)", key: "super1", width: 25 },
  { header: "Quantité Restante Super(l)", key: "super", width: 25 },
  { header: "Consommation Gasoil(l)", key: "gazoil1", width: 25 },
  { header: "Quantité Restante Gasoil(l)", key: "gazoil", width: 25 }
];
const CARS_LABEL = [
  { header: "Marque", key: "marque", width: 25 },
  { header: "Capacité(l)", key: "capacity", width: 25 },
  { header: "Type", key: "type", width: 25 },
  { header: "Nombre de réservoir", key: "number_of_reservoir", width: 25 },
  { header: "Immatriculation", key: "immatriculation", width: 25 },
  { header: "Kilométrage", key: "kilometrage", width: 25 },
  { header: "Soute", key: "hold", width: 25 }
];
const CARS_LABEL_SERVICE = [
  { header: "Marque", key: "marque", width: 25 },
  { header: "Capacité", key: "capacity", width: 25 },
  { header: "Type", key: "type", width: 25 },
  { header: "Nombre de réservoir", key: "number_of_reservoir", width: 25 },
  { header: "Immatriculation", key: "immatriculation", width: 25 },
  { header: "Kilométrage", key: "kilometrage", width: 25 },
  { header: "Service", key: "hold", width: 25 }
];
const USERS_LABEL = [
  { header: "Matricule", key: "matricule", width: 15 },
  {
    header: "Noms et Prénoms",
    key: "name",
    width: 20
  },
  { header: "Login", key: "login", width: 20 },
  { header: "Grade", key: "grade", width: 20 },
  { header: "Téléphone", key: "phone", width: 20 },
  {
    header: "Rôle",
    key: "role",
    width: 20
  }
];
const BONS_LABEL = [
  { header: "Départ", key: "departure", width: 20 },
  {
    header: "Destination",
    key: "destination",
    width: 20
  },
  { header: "Type d'essence", key: "fuel_type", width: 20 },
  { header: "Nombre de litre initial", key: " initial_number_of_liter", width: 20 },
  { header: "Nombre de litre après consommation", key: "number_of_liter", width: 30 },
  { header: "Véhicule", key: "car", width: 25 },
  { header: "Conducteur", key: "driver", width: 25 },
  { header: "Date d'émission", key: "emission_date", width: 25 },
  { header: "Date de consommation", key: "consumed_date", width: 25 },
  { header: "Kilométrage a la consommation", key: "coverage_when_consuming", width: 25 },
  { header: "Consommé", key: "consumed", width: 10 }
];
module.exports = {
  STATISTIQUES,
  HOLD_STATS_LABEL,
  SERVICES_LABEL,
  CARS_LABEL,
  USERS_LABEL,
  CARS_LABEL_SERVICE,
  CONSOMMATION_SERVICES_LABEL,
  BONS_LABEL
};
