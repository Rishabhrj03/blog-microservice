const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { response } = require('express');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = {};
app.get('/posts', (req, res) => {
  res.send(posts);
});
handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = {
      id,
      title,
      comments: [],
    };
  }
  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === 'CommentUpdated') {
    console.log('I am working 0000000030 ', data);

    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};
app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.listen(4002, async () => {
  console.log('Listen on 4002');
  const res = await axios.get('http://localhost:4005/events');
  for (let event of res.data) {
    console.log('Process event', event.type);
    handleEvent(event.type, event.data);
  }
});
