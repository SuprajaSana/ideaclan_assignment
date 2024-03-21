const { gql } = require("apollo-server");

module.exports = gql`
  type Book {
    id: ID!
    title: String!
    description: String!
    price: String!
    createdAt: String!
    admin: String!
    owner: String!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    role: String!
  }
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmpassword: String!
    role: String!
  }
  type Query {
    getBooks: [Book]
    getBook(bookId: ID!): Book!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    addBooks(title: String!, description: String!, price: String!): Book!
    buyBooks(bookId: ID!): Book!
    borrowBooks(bookId: ID!): Book!
  }
`;
