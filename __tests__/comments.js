const postPopular = async (agent) => {


  const { body: comment } = await agent.post("/api/v1/comments").send({
    userId: user.body.id,
    postId: post.body.id,
    comment: "Comment #1"
  });

  return comment;
  
};

module.exports = postPopular();
