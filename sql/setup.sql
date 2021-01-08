DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS posts_tags;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  profile_photo_url TEXT
);

CREATE TABLE posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  photo_url TEXT NOT NULL,
  caption TEXT,
  tags TEXT[]
);

CREATE TABLE comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  post_id BIGINT REFERENCES posts(id),
  comment TEXT NOT NULL
);

-- sam: "i thought it'd be fun"

CREATE TABLE tags (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tag_text TEXT NOT NULL
);

CREATE TABLE posts_tags (
  post_id BIGINT REFERENCES posts(id),
  tag_id BIGINT REFERENCES tags(id),
  PRIMARY KEY(post_id, tag_id)
);
