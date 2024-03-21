const Book = require("../../models/Book");
const authContext = require("../../util/auth");

module.exports = {
  Query: {
    async getBooks(_, {}, context) {
      try {
        const user = authContext(context);
        const books = await Book.find();
        return books;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getBook(_, { bookId }, context) {
      try {
        const user = authContext(context);
        const book = Book.findById(bookId);
        if (book) {
          return book;
        } else {
          throw new Error("Book not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async addBooks(_, { title, description, price }, context) {
      try {
        const user = authContext(context);

        const diffBook = await Book.findOne({ title });

        if (user.role === "admin") {
          const newBook = new Book({
            title,
            description,
            price,
            admin: user.username,
            owner: "",
            createdAt: new Date().toISOString(),
            user: user.id,
          });

          if (!diffBook) {
            const book = await newBook.save();
            return book;
          } else {
            throw new Error("Title already exists");
          }
        } else {
          throw new Error("Admins can only add books");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async buyBooks(_, { bookId }, context) {
      try {
        const user = authContext(context);

        const newBook = await Book.findById(bookId);

        if (user.role !== "admin") {
          if (!newBook.owner) {
            (newBook.owner = user.username), (newBook.user = user.id);
          } else if (newBook.owner === user.username) {
            throw new Error("Already you owned this book");
          } else {
            throw new Error("Already owned by someone");
          }

          const book = await newBook.save();

          return book;
        } else {
          throw new Error("User can only buy books");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async borrowBooks(_, { bookId }, context) {
      try {
        const user = authContext(context);

        const newBook = await Book.findById(bookId);

        if (user.role !== "admin") {
          if (newBook.owner !== user.username) {
            newBook.owner = user.username;
            newBook.user = user.id;
          } else {
            throw new Error("You already owned this book");
          }

          const book = await newBook.save();

          return book;
        } else {
          throw new Error("User can only buy books");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
