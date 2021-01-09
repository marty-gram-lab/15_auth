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

    user = await agent.post("/api/v1/auth/signup").send({
      email: "myemail@email.com",
      password: "password",
      profilePhotoURL: "myphotourl.com"
    });
  });

  it("should insert a post via POST", async () => {
    const res = await agent.post("/api/v1/posts").send({
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      tags: ["#tag1", "#tag2"]
    });

    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.body.id,
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      tags: ["#tag1", "#tag2"],
    });
  });

  it("should DELETE a post by id", async () => {
    const { body: post } = await agent.post("/api/v1/posts").send({
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      tags: ["#tag1", "#tag2"],
    });

    const res = await agent.delete(`/api/v1/posts/${post.id}`);

    expect(res.body).toEqual({
      id: expect.any(String),
      userId: user.body.id,
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      tags: ["#tag1", "#tag2"],
    });
  });

  it("should GET some posts", async () => {
    const posts = await Promise.all([
      agent.post("/api/v1/posts").send({ photoUrl: "coolpic1.com" }),
      agent.post("/api/v1/posts").send({ photoUrl: "coolpic2.com" }),
      agent.post("/api/v1/posts").send({ photoUrl: "coolpic3.com" }),
      agent.post("/api/v1/posts").send({ photoUrl: "coolpic4.com" }),
    ]).then((posts) => posts.map((post) => post.body));

    const res = await agent.get("/api/v1/posts");

    expect(res.body).toEqual(expect.arrayContaining(posts));
    expect(res.body.length).toEqual(posts.length);
  });

  it("should GET a post by id", async () => {
    const { body: post } = await agent.post("/api/v1/posts").send({
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      tags: ["#tag1", "#tag2"],
    });

    const res = await agent.get(`/api/v1/posts/${post.id}`);

    expect(res.body).toEqual({
      id: post.id,
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      tags: ["#tag1", "#tag2"],
      userId: expect.any(String),
      comments: [null]
    });
  });

  it("should PATCH an existing post", async () => {
    const { body: post } = await agent.post("/api/v1/posts").send({
      photoUrl: "myNewPostPic.com",
      caption: "Here is my cool photo",
      tags: ["#tag1", "#tag2"],
    });

    const updatedCaption = { caption: "cool newwww captiom" };

    const res = await agent
      .patch(`/api/v1/posts/${post.id}`)
      .send(updatedCaption);

    expect(res.body).toEqual({
      id: post.id,
      photoUrl: "myNewPostPic.com",
      caption: "cool newwww captiom",
      tags: ["#tag1", "#tag2"],
      userId: expect.any(String),
    });
  });


  it("should return the top ten posts with get", async() => {
    const array = [];

    for(let i = 0; i < 3; i++){
      array.push(i);
    }
    
    const posts = await Promise.all(
      array.map(item => agent.post("/api/v1/posts").send({ 
        photoUrl:`coolpic${item}.com` })
      )).then(posts => posts.map(post => post.body));

    const commentsGroupOne = await Promise.all([
      agent.post("/api/v1/comments").send({ userId: user.body.id, postId: posts[0].id, comment: "1.1" })
    ]).then(comments => comments.map(com => com.body));

    const commentsGroupTwo = await Promise.all([
      agent.post("/api/v1/comments").send({ userId: user.body.id, postId: posts[1].id, comment: "2.1" }),
      agent.post("/api/v1/comments").send({ userId: user.body.id, postId: posts[1].id, comment: "2.2" })
    ]).then(comments => comments.map(com => com.body));

    const commentsGroupThree = await Promise.all([
      agent.post("/api/v1/comments").send({ userId: user.body.id, postId: posts[2].id, comment: "3.1" }),
      agent.post("/api/v1/comments").send({ userId: user.body.id, postId: posts[2].id, comment: "3.2" }),
      agent.post("/api/v1/comments").send({ userId: user.body.id, postId: posts[2].id, comment: "3.3" })
    ]).then(comments => comments.map(com => com.body));

    const res = await agent
      .get("/api/v1/posts/popular");

    expect(res.body).toEqual([
      {
        id: expect.any(String),
        caption: null,
        tags: null,
        userId: "1",
        photoUrl: "coolpic2.com",
        email: "myemail@email.com",
        numberOfComments: "3"
      },
      {
        id: expect.any(String),
        caption: null,
        tags: null,
        userId: "1",
        photoUrl: "coolpic1.com",
        email: "myemail@email.com",
        numberOfComments: "2"
      },
      {
        id: expect.any(String),
        caption: null,
        tags: null,
        userId: "1",
        photoUrl: "coolpic0.com",
        email: "myemail@email.com",
        numberOfComments: "1"
      }
    ]);
  });
});

