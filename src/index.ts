import http from 'http';
import url from 'url';
import { blue, yellow, white, bold, green } from 'colorette';
import util from 'util';
import Prettier from './plugins/ts/prettier.ts'
import Logger from './plugins/ts/logger.ts' 

type RequestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => void;

interface Route {
  method: string;
  path: string;
  handler: RequestHandler;
}

interface Middleware {
  (req: http.IncomingMessage, res: http.ServerResponse, next: () => void): void;
}

class Server {
  private routes: Route[] = [];
  private middleware: Middleware[] = [];
  private prettier?: Prettier;
  private server: http.Server;

  constructor(options: { port?: number; prettier?: Prettier }) {
    const { port, prettier } = options;
    const pref = yellow("[TRYN] ");
    this.prettier = prettier;
    this.server = http.createServer(this.app);
    this.server.on('listening', this.onListening);
    this.server.on('close', this.onClose);
    this.server.listen(port || 80);
    console.log(pref + blue("Web app started!"));
    console.log(pref + white("Preview: ") + bold(white(`http://localhost:${port || 80}`)));
  }

  private app: RequestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url || '', true);
    const { pathname } = parsedUrl;
    const method = (req.method || '').toLowerCase();

    // Apply middleware
    this.applyMiddleware(req, res, () => {
      // Find matching route
      const route = this.routes.find(
        r => r.path === pathname && r.method === method
      );

      if (route) {
        res.json = (data: any) => {
          res.setHeader('Content-Type', 'application/json');
          if (this.prettier) {
            res.end(this.prettier.pretty(data));
          } else {
            res.end(JSON.stringify(data));
          }
        };
        res.write = (data: any) => {
          res.write(data);
        };
        route.handler(req, res);
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    });
  };

  private applyMiddleware(req: http.IncomingMessage, res: http.ServerResponse, done: () => void) {
    let index = 0;

    const next = () => {
      index++;
      if (index < this.middleware.length) {
        this.middleware[index](req, res, next);
      } else {
        done();
      }
    };

    if (this.middleware.length > 0) {
      this.middleware[index](req, res, next);
    } else {
      done();
    }
  }

  use(middleware: Middleware) {
    this.middleware.push(middleware);
    this.routes.push({ method: 'use', path: '', handler: middleware });
  }

  private onListening = () => {
    const { port } = this.server.address() as any;
    console.log(yellow("[TRYN]") + blue(" Running on ") + green(port) + white(" port"));
  };

  private onClose = () => {
    console.log(yellow("[TRYN]") + blue(" Server closed."));
  };

  get(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'get', path, handler });
  }

  post(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'post', path, handler });
  }

  delete(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'delete', path, handler });
  }

  patch(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'patch', path, handler });
  }

  put(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'put', path, handler });
  }

  close(callback?: () => void) {
    this.server.close(callback);
  }
}

export { Server, Prettier, Logger };
