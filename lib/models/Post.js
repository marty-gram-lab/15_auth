const pool = require('../utils/pool');

module.exports = class Post {
    id;
    user_id;
    photo_url;
    caption;

    constructor({ id, user_id, photo_url, caption }) {
      this.id = id;
      this.userId = user_id;
      this.photoUrl = photo_url;
      this.caption = caption;
    }

    static async insert({ userId, photoUrl, caption }) {

      const { rows } = await pool.query(`
        INSERT INTO posts (user_id, photo_url, caption)
        VALUES ($1, $2, $3)
        RETURNING *
        `, [userId, photoUrl, caption]);

      return new Post(rows[0]);
    }

    static async delete({ id, userId }) {

      const { rows } = await pool.query(`
        DELETE FROM posts 
        WHERE id=$1 
        AND user_id=$2 
        RETURNING *
        `, [id, userId]);

      return new Post(rows[0]);
    }
};
