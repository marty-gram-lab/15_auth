/* eslint-disable no-undef */
const pool = require("../utils/pool");
const _ = require("lodash");

module.exports = class Tag {
  id;
  tagText;

  constructor({ id, tagText }) {
    this.id = id;
    this.tagText = tag_text;
  }

  static async insert(tags) {
    const { rows: existingTags } = await pool.query(
      `
        SELECT * FROM tags
        WHERE tag_text=ANY($1::text[])
    `,
      [tags]
    );

    // _.differenceWith(a, b, _.isEqual);
    const newTags = tags.filter((tag) => !existingTags.includes(tag));

    const insertedTags = await Promise.all(
      newTags.map((tag) =>
        pool.query(
          `
          INSERT INTO tags (tag_text)
          VALUES ($1)
          RETURNING *;
      `,
          [tag]
        )
      )
    );

    console.log("existingTags", existingTags);
    console.log("insertedTags", insertedTags);

    // we need the tag ids to insert into the junction table
    // so we can associate the tags to the posts
  }
};
