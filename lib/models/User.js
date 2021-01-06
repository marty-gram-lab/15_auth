const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  passwordHash;
  profilePhotoURL;

  constructor({ id, email, password_hash, profile_photo_url }) {
    this.id = id;
    this.email = email;
    this.passwordHash = password_hash;
    this.profilePhotoURL = profile_photo_url;
  }

  static async insert(user) {
    const { email, passwordHash, profilePhotoURL } = user;

    const { rows } = await pool.query(`
      INSERT INTO users (email, password_hash, profile_photo_url)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [email, passwordHash, profilePhotoURL]);

    return new User(rows[0]);
  }

  toJSON() {
    const json = { ...this };
    delete json.passwordHash;
    return json; 
  }
};
