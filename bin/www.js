const http = require("http");
const app = require("../app");
const hostname = "127.0.0.1";
const port = 3001;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`run at http://${hostname}:${port}`);
});
