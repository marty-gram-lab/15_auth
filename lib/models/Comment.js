const pool = require("../utils/pool");

module.exports = class Comment {
  id;
  userId;
  postId;
  comment;

  constructor({ id, user_id, post_id, comment }) {
    this.id = id;
    this.userId = user_id;
    this.postId = post_id;
    this.comment = comment;
  }
  static async insert({ userId, postId, comment }) {
    const { rows } = await pool.query(
      `INSERT INTO comments (user_id, post_id, comment) 
        VALUES ($1, $2, $3)
        RETURNING *`,
      [userId, postId, comment]
    );
    return new Comment(rows[0]);
  }

  static async delete({ id, userId }) {
    const { rows } = await pool.query(`
      DELETE FROM comments 
      WHERE id=$1 
      AND user_id=$2 
      RETURNING *`,
    [id, userId]
    );
    if(!rows[0]) throw new Error(`No comment with id ${id} found`);

    return new Comment(rows[0]);
  }




};
