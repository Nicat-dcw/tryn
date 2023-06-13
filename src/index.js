import http from 'http'; 
import url from 'url';
import { blue, yellow, white, bold, green } from 'colorette';
import util from 'util';
import Prettier from './plugins/esm/prettier.js'
import Logger from './plugins/esm/logger.js' 

const routes = [];

class Server {
  constructor(options) {
    const { port, prettier } = options;
    const pref = yellow("[TRYN] ");
    this.routes = routes;
    this.prettier = prettier;
    this.middleware = [];
    this.server = http.createServer(this.app);
    this.server.on('listening', this.onListening);
    this.server.on('close', this.onClose);
    this.server.listen(port ? port : 80);
    console.log(pref + blue("Web app started!"));
    console.log(pref + white("Preview: ") + bold(white(`http://localhost:${port ? port : 80}`)));
  }

  app = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    const method = req.method.toLowerCase();

    // Apply middleware
    this.applyMiddleware(req, res);

    // Find matching route
    const route = this.routes.find(
      r => r.path === pathname && r.method === method
    );

    if (route) {
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json');
        if (this.prettier) {
          res.end(this.prettier.pretty(data));
        } else {
          res.end(JSON.stringify(data));
        }
      };
      res.write = (data) => {
        res.write(data);
      };
      route.handler(req, res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  }

  applyMiddleware(req, res) {
    for (const middleware of this.middleware) {
      middleware(req, res);
    }
  }

  use(middleware) {
    this.middleware.push(middleware);
    this.routes.push({ method: 'use', handler: middleware });
  }

  onListening = () => {
  const address = this.server.address();
  const port = address ? address.port : 'unknown';
  console.log(yellow("[TRYN]") + blue(" Running on ") + green(port) + white(" port"));
  }

  onClose = () => {
    console.log(yellow("[TRYN]") + blue(" Server closed."));
  }

  get(path, handler) {
    this.routes.push({ method: 'get', path, handler });
  }

  post(path, handler) {
    this.routes.push({ method: 'post', path, handler });
  }

  delete(path, handler) {
    this.routes.push({ method: 'delete', path, handler });
  }

  patch(path, handler) {
    this.routes.push({ method: 'patch', path, handler });
  }

  put(path, handler) {
    this.routes.push({ method: 'put', path, handler });
  }

  close(callback) {
    this.server.close(callback);
  }
}

export { Server, Prettier, Logger };
