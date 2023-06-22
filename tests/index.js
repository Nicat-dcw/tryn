import { Server, Logger, Prettier } from '../src/index.js';

const server = new Server({
  prettier: new Prettier(),
  rateLimit: {
    limit: 1, // Maximum 100 requests within the interval
    interval: 1000, // 1 minute interval,
    message: "Hey!"
  },
});

server.use(new Logger().log)

server.engine("view", "ejs") 

server.get('/users', (req, res) => {
  // Handle GET /users
  res.end('Get users');
  req.close();
});
server.get("/", (req,res) => {
    //res.json({ status: 200 })
    console.log(req.connection.device())
    res.server.render("./views/index.ejs")
})
server.get("/l", (req,res) => {
    res.json({ message: "Turned off" })
    req.close();
})