const fs = require("fs");
const pool = require("../lib/utils/pool");
const request = require("supertest");
const app = require("../lib/app");

describe("Comment Routes", () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync("./sql/setup.sql", "utf-8"));
  });

  let agent, user, post;

  beforeEach(async() => {
    agent = request.agent(app);

    user = await agent.post("/api/v1/auth/signup").send({
      email: "myemail@email.com",
      password: "password",
      profilePhotoURL: "myphotourl.com"
    });
    post = await agent.post("/api/v1/posts").send({
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      tags: ["#tag1", "#tag2"]
    });
  });


  it("post a new comment", async() => {
    const newUser = await agent.post("/api/v1/auth/signup").send({
      email: "newnew@user.com",
      password: "12345",
      profilePhotoURL: "something.com"
    });

    const res = await agent.post("/api/v1/comments").send({
      userId: newUser.id,
      postId: 1,
      comment: "Rainbows and love y'all"
    });
    
    expect(res.body).toEqual({
      id: expect.any(String),
      userId: newUser.id,
      postId: 1,
      comment: "Rainbows and love y'all"
    });
  });

});
