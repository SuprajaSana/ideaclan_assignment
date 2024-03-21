const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

require("dotenv").config();

const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

function generalToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.TOKEN_KEY
  );
}

module.exports = {
  Mutation: {
    async login(_, { email, password }) {
      const { valid, errors } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ email });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generalToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { username, email, password, confirmpassword, role } }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmpassword,
        role
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const checkUser = await User.findOne({ email });

      if (checkUser) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "Email is already taken",
          },
        });
      }

      password = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        email,
        password,
        role,
      });

      const res = await user.save();

      const token = generalToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
