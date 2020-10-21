const { GraphQLServer } = require("graphql-yoga");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const Log = require("./resolvers/Log");
const Notification = require("./resolvers/Notification");
const Hold = require("./resolvers/Hold");
const { prisma } = require("./generated/prisma-client");
const { typeDefs } = require("./schema.graphql");
const { makeExecutableSchema } = require("graphql-tools");
const resolvers = {
  Mutation,
  Query,
  Log,
  Hold,
  Notification
};
const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new GraphQLServer({
  schema,
  context: (request) => ({ ...request, prisma })
});
server.start(() => console.log("Server is running on http://localhost:4000"));
