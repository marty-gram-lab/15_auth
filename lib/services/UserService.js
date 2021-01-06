const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = class UserService {
  static create({ email, password, profilePhotoURL }) {
    const passwordHash =  bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
    
    return User
      .insert({ email, passwordHash, profilePhotoURL });
  }
};
