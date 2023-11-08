const http = require('http');

const server = http.createServer((req, res) => {
  console.log('request event');
  console.log(req.url);
  res.end('Hello World');
});

server.listen(5000, () => {
  console.log('Server listening on port : 5000....');
});
