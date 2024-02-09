import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;


const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app }); 

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
});
