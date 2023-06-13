import { Server, Logger, Prettier } from '../src/index.js';

const server = new Server({ prettier: new Prettier()});
server.use(new Logger().log) 

server.get('/users', (req, res) => {
  // Handle GET /users
  res.end('Get users');
  req.close();
});
server.get("/", (req,res) => {
    res.json({ status: 200 })
})