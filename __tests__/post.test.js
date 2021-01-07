const fs = require("fs");
const pool = require("../lib/utils/pool");
const request = require("supertest");
const app = require("../lib/app");

describe("Post Routes", () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync("./sql/setup.sql", "utf-8"));
  });

  let agent, user;

  beforeEach( async() => {
    agent = request.agent(app);

    user = await agent
      .post("/api/v1/auth/signup")
      .send({
        email: "myemail@email.com",
        password: "password",
        profilePhotoURL: "myphotourl.com"
      });
  });

  it("it should insert a post via POST", async() => {

    const res = await agent
      .post("/api/v1/posts")
      .send({
        // userId: user.body.id,
        photoUrl: "myNewPostPic.com",
        caption: "Here is my cool photo"
        // tags: ["#cool", "#photo"]
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.body.id,
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo"
    //   tags: ["#cool", "#photo"]
    });

  });

});
