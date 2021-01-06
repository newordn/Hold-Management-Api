const { GraphQLServer } = require("graphql-yoga");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const Log = require("./resolvers/Log");
const Notification = require("./resolvers/Notification");
const Hold = require("./resolvers/Hold");
const Service = require("./resolvers/Service");
const User = require("./resolvers/User");
const Car = require("./resolvers/Car");
const Bon = require("./resolvers/Bon");
const HoldsOnBons = require("./resolvers/HoldsOnBons");
const { prisma } = require("./generated/prisma-client");
const { typeDefs } = require("./schema.graphql");
const { makeExecutableSchema } = require("graphql-tools");
const {storeUpload} = require('./helpers/upload')
const resolvers = {
  Mutation,
  Query,
  Log,
  Hold,
  Notification,
  User,
  Car,
  Bon,
  HoldsOnBons,
  Service
};
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new GraphQLServer({
  schema,
  context: (request) => ({ ...request, prisma,storeUpload })
});
server.start(() => console.log("Server is running on http://localhost:4000"));
