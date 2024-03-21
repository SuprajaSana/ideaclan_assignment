const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(
    "mongodb+srv://sanasupraja2727:Sana123@cluster0.7h2e61i.mongodb.net/user_books?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log("Server running");
  });
