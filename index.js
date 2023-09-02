/**
 * Date: September 1
 * Github Scanner
 */

const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const typeDefs = require('./types');
const resolvers = require('./resolvers');

const app = express();
let apolloServer = null;

const startServer = async () => {
    apolloServer = new ApolloServer({
	  typeDefs,
	  resolvers,
	});
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}
startServer();

const PORT = process.env.PORT || 4000;

app.listen({ port: PORT }, () => {  
  console.log(`/***************************************/\n`);
  console.log("\x1b[34m%s\x1b[0m", ` Running ${apolloServer.graphqlPath} | listening on ${PORT}\n`);
  console.log(`/***************************************/\n`);
});