const request = require("supertest");
const app = require("../lib/app");

const agent = request.agent(app);

module.exports = () => {
  const array = [];

  for(let i = 0; i < 20; i++){
    array.push(i);
  }
  return Promise.all(
    array.map(item => agent.post("/api/v1/posts").send({ 
      photoUrl:`coolpic${item}.com` })
    )).then(posts => posts.map(post => post.body));
};
