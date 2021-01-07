const fs = require("fs");
const pool = require("../lib/utils/pool");
const request = require("supertest");
const app = require("../lib/app");

describe("Post Routes", () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync("./sql/setup.sql", "utf-8"));
  });

  let agent, user;

  beforeEach(async() => {
    agent = request.agent(app);

    user = await agent
      .post("/api/v1/auth/signup")
      .send({
        email: "myemail@email.com",
        password: "password",
        profilePhotoURL: "myphotourl.com"
      });
  });

  it("should insert a post via POST", async() => {
    const res = await agent
      .post("/api/v1/posts")
      .send({
        photoUrl: "myNewPostPic.com",
        caption: "Here is my cool photo"
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.body.id,
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo"
    });
  });

  it("should DELETE a post by id", async() => {
    const { body: post } = await agent
      .post("/api/v1/posts")
      .send({
        photoUrl: "myNewPostPic.com",
        caption: "Here is my cool photo"
      });

    const res = await agent
      .delete(`/api/v1/posts/${post.id}`);

    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.body.id,
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo"
    });
  });

  it("should GET some posts", async() => {
    const posts = await Promise.all([
      agent.post("/api/v1/posts").send({ photoUrl: "coolpic1.com" }),
      agent.post("/api/v1/posts").send({ photoUrl: "coolpic2.com" }),
      agent.post("/api/v1/posts").send({ photoUrl: "coolpic3.com" }),
      agent.post("/api/v1/posts").send({ photoUrl: "coolpic4.com" })
    ]).then(posts => posts.map(post => post.body));

    const res = await agent.get("/api/v1/posts");

    expect(res.body).toEqual(expect.arrayContaining(posts));
    expect(res.body.length).toEqual(posts.length);
  });

  it("should GET a post by id", async() => {
    const { body: post } = await agent
      .post("/api/v1/posts")
      .send({
        photoUrl: "myNewPostPic.com",
        caption: "Here is my cool photo"
      });

    const res = await agent
      .get(`/api/v1/posts/${post.id}`);

    expect(res.body).toEqual({
      id: post.id,
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      userId: expect.any(String)
    });
  });

  it("should PATCH an existing post", async() => {
    const { body: post } = await agent
      .post("/api/v1/posts")
      .send({
        photoUrl: "myNewPostPic.com",
        caption: "Here is my cool photo"
      });

    const updatedCaption = "cool newwww captiom";

    const res = await agent
      .patch(`/api/v1/posts/${post.id}`)
      .send(updatedCaption);

    expect(res.body).toEqual({
      id: post.id,
      photoUrl: "myNewPostPic.com",
      caption: "cool newwww captiom",
      userId: expect.any(String)
    });
  });
});
