const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = class UserService {
  static create({ email, password, profilePhotoURL }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    return User.insert({ email, passwordHash, profilePhotoURL });
  }

  static authToken(user) {
    return jwt.sign({ user: user.toJSON() }, process.env.APP_SECRET, {
      expiresIn: "24h",
    });
  }

  static verifyAuthToken(token) {
    return jwt.verify(token, process.env.APP_SECRET).user;
  }

  static authorize({ email, password }) {
    return User.findByEmail(email)
      .then((user) => {
        return {
          passwordsMatch: bcrypt.compare(password, user.passwordHash),
          user,
        };
      })
      .then((res) => {
        if (res.passwordsMatch) {
          return res.user;
        } else {
          throw new Error("Invalid Password");
        }
      })
      .catch((err) => {
        err.status = 401;
        throw err;
      });
  }
};
