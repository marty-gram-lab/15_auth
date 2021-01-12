const pool = require("../utils/pool");

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

  static async insert({ email, passwordHash, profilePhotoURL }) {

    const { rows } = await pool.query(`
      INSERT INTO users (email, password_hash, profile_photo_url)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [email, passwordHash, profilePhotoURL]);

    return new User(rows[0]);
  }

  static async findByEmail(email) {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if(!rows[0]) throw new Error(`No user with email ${email} found.`);
    return new User(rows[0]);
  }

  static async getPopular() {
    const { rows } = await pool.query(
      `
      SELECT users.*, COUNT(comments) AS comment_count
      FROM users
      JOIN posts
      ON posts.user_id = users.id
      JOIN comments
      ON comments.post_id = posts.id
      GROUP BY users.id
      ORDER BY comment_count DESC
      LIMIT 10
      `);

    return rows.map(user => {
      return {
        ...new User(user),
        numberOfComments: user.comment_count
      };
    });
  }

  toJSON() {
    const json = { ...this };
    delete json.passwordHash;
    return json; 
  }
};
