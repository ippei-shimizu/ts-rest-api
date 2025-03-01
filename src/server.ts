import http from 'http';

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  console.log(`${req.method} ${req.url}`);

  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Not Found' }));
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
