const userResolvers = require("./users");
const bookResolvers = require("./books");

module.exports = {
  Query: {
    ...bookResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...bookResolvers.Mutation,
  },
};
