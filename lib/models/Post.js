const pool = require("../utils/pool");

module.exports = class Post {
  id;
  user_id;
  photo_url;
  caption;
  tags;
  comments;

  constructor({ id, user_id, photo_url, caption, tags, comments }) {
    this.id = id;
    this.userId = user_id;
    this.photoUrl = photo_url;
    this.caption = caption;
    this.tags = tags;
    this.comments = comments;
  }

  static async insert({ userId, photoUrl, caption, tags }) {
    const { rows } = await pool.query(
      `
      INSERT INTO posts (user_id, photo_url, caption, tags)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [userId, photoUrl, caption, tags]
    );

    return new Post(rows[0]);
  }

  static async delete({ id, userId }) {
    const { rows } = await pool.query(
      `
      DELETE FROM posts 
      WHERE id=$1 
      AND user_id=$2 
      RETURNING *
      `,
      [id, userId]
    );

    return new Post(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query("SELECT * FROM posts");

    return rows.map((post) => new Post(post));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `
      SELECT posts.*, array_agg(comments.comment) AS comments
      FROM posts
      LEFT JOIN comments
      ON comments.post_id = posts.id
      WHERE posts.id = $1
      GROUP BY posts.id
    `,
      [id]
    );

    if(!rows[0]) throw new Error(`No post with id ${id} found`);

    return new Post(rows[0]);
  }

  static async updateCaption({ id, caption, userId }) {
    const { rows } = await pool.query(
      `
      UPDATE posts
      SET caption=$1
      WHERE id=$2
      AND user_id=$3
      RETURNING *
    `,
      [caption, id, userId]
    );

    if (!rows[0]) throw new Error(`No post with id ${id} found`);

    return new Post(rows[0]);
  }

  static async getPopular() {
    const { rows } = await pool.query(`
      SELECT
        posts.*,
        users.email,
        COUNT(comments) AS number_of_comments,
        RANK() OVER (ORDER BY COUNT(comments) DESC)
      FROM posts
      LEFT JOIN comments
      ON comments.post_id = posts.id
      JOIN users
      ON users.id = posts.user_id
      GROUP BY (posts.id, users.email)
      LIMIT 10`
    );
    
    return rows.map(row => {
      return {
        ...new Post(row),
        email: row.email,
        numberOfComments: row.number_of_comments
      };
    });
  }
};
