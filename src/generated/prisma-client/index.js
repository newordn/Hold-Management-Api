"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "DotationEmetteur",
    embedded: false
  },
  {
    name: "Dotation",
    embedded: false
  },
  {
    name: "Log",
    embedded: false
  },
  {
    name: "Hold",
    embedded: false
  },
  {
    name: "HoldsOnBons",
    embedded: false
  },
  {
    name: "Bon",
    embedded: false
  },
  {
    name: "Notification",
    embedded: false
  },
  {
    name: "Car",
    embedded: false
  },
  {
    name: "Service",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://us1.prisma.sh/neword-2bedf8/Hold-Management-Api/dev`
});
exports.prisma = new exports.Prisma();
