import http from 'http';
import url from 'url';
import { blue, yellow, white, bold, green } from 'colorette';
import util from 'util';
import ejs from 'ejs';
import Prettier from './plugins/esm/prettier.js';
import Logger from './plugins/esm/logger.js';
import RateLimiter from './plugins/esm/rateLimiter.js' 
import DeviceDetector from "node-device-detector";

const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});
const routes = [];

class Server {
  constructor(options) {
    const { port, prettier, rateLimit } = options || {};
    const pref = yellow('[TRYN] ');
    this.routes = routes;
    this.prettier = prettier;
    this.middleware = [];
    this.server = http.createServer(this.app);
    this.server.on('listening', this.onListening);
    this.server.on('close', this.onClose);
    this.server.listen(port ? port : 80);
    console.log(pref + blue('Web app started!'));
    console.log(pref + white('Preview: ') + bold(white(`http://localhost:${port ? port : 80}`)));
    /* Rate Limit */
    if (rateLimit) {
      const { limit, interval } = rateLimit;
      const limiter = new RateLimiter(limit, interval);
      this.use(limiter.checkRateLimit.bind(limiter));
    }
  }

  app = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;
    const method = req.method.toLowerCase();

    // Apply middleware
    this.applyMiddleware(req, res, () => {
      // Find matching route
      const route = this.routes.find((r) => r.path === pathname && r.method === method);

      if (route) {
        res.status = {
          json: (data) => {
            res.statusCode = Number(this.code);
            res.setHeader('Content-Type', 'application/json');
            if (this.prettier) {
              res.end(this.prettier.pretty(data));
            } else {
              res.end(JSON.stringify(data));
            }
          }
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          if (this.prettier) {
            res.end(this.prettier.pretty(data));
          } else {
            res.end(JSON.stringify(data));
          }
        };
        req.close = (data) => {
          this.server.close(() => {
            return;
          });
        };
        res.write = (data) => {
          res.write(data);
        };
        res.server = {
          render: (view, data, callback) => {
            if (this.engine === 'ejs') {
              ejs.renderFile(view, {}, (err, html) => {
                if (err) {
                  callback(err);
                } else {
                  res.setHeader('Content-Type', 'text/html');
                  res.end(html);
                }
              });
            } else {
              throw new Error('Template engine not supported.');
            }
          },
        };
        req.connection = {
          device: () => {
            const result = detector.detect(req.headers["user-agent"]); 
            const deviceOs = result.device.model;
            return {
              device: deviceOs,
              ...result
            };
          }
        };
        route.handler(req, res);
      } else {
        res.statusCode = 404;
        res.end("Tryn Error: The Page doesn't exist.");
      }
    });
  };

  applyMiddleware(req, res, next) {
    let index = 0;

    const runMiddleware = () => {
      if (index >= this.middleware.length) {
        // All middleware functions have been executed
        // Call the next function
        next();
      } else {
        const middleware = this.middleware[index];
        index++;

        // Invoke the middleware function with the appropriate arguments
        middleware(req, res, runMiddleware);
      }
    };

    // Start running the middleware functions
    runMiddleware();
  }

  use(middleware) {
    this.middleware.push(middleware);
    this.routes.push({ method: 'use', handler: middleware });
  }

  onListening = () => {
    const address = this.server.address();
    const port = address ? address.port : 'unknown';
    console.log(yellow('[TRYN]') + blue(' Running on ') + green(port) + white(' port'));
  };

  onClose = () => {
    console.log(yellow('[TRYN]') + blue(' Server closed.'));
  };

  engine(key, value) {
    if (key === 'view') {
      this.engine = value;
    }
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
