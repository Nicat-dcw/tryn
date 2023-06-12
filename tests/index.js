import { Server, Prettier } from '../src/index.js';
//import cors from 'cors' 

const server = new Server({ port: 8080, prettier: new Prettier()});

//server.use(cors()) 
server.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.json({ hello: "world" })
  //res.end('Hello, Web Framework!');
});
/*
server.post('/users', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Creating a new user...');
});

server.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Deleting user with ID ${id}`);
});

server.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Updating user with ID ${id}`);
});

server.put('/users/:id', (req, res) => {
  const { id } = req.params;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`Replacing user with ID ${id}`);
});*/
/*
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
*/