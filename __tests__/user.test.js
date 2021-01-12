const fs = require("fs");
const pool = require("../lib/utils/pool");
const request = require("supertest");
const app = require("../lib/app");

const User = require("../lib/models/User");
const Post = require("../lib/models/Post");
const Comment = require("../lib/models/Comment");

describe("Comment Routes", () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync("./sql/setup.sql", "utf-8"));
  });

  let agent, users, posts, comments;

  beforeEach(async() => {
    const numberOfUsers = 10;

    agent = request.agent(app);

    users = await Promise.all([...Array(numberOfUsers)]
      .map((_, i) => User.insert({ 
        email: `usernumber${i}@test.com`,
        passwordHash: `hash${i}`,
        profilePhotoURL: `photo${i}.com`
      }))
    );

    posts = await Promise.all(users.map(user => {
      const numberOfPosts = [...Array(Number(user.id))];

      return Promise.all(numberOfPosts
        .map((_, i) => Post.insert({
          userId: user.id,
          photoUrl: `${user.id}-${i}`
        }))
      );
    }));

    comments = await Promise.all(posts.map(postList => {
      return Promise.all(postList.map(post => {
        return Comment.insert({
          postId: post.id,
          comment: `${post.userId}-${post.id}`,
          userId: Math.floor(Math.random() * 10 + 1)
        });
      }));
    }));
  });

  it("should get the 10 users with the most comments", async() => {
    const { body: popularUsers } = await agent
      .get("/api/v1/users/popular");

    expect(popularUsers.length).toEqual(10);
  });

});
