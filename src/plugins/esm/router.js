class Router {
  constructor() {
    this.routes = [];
  }

  handleRequest(req, res) {
    const { pathname } = new URL(req.url, 'http://localhost');
    const method = req.method.toUpperCase();

    const matchingRoutes = this.routes.filter(route =>
      route.method === method && route.path === pathname
    );

    if (matchingRoutes.length > 0) {
      let currentRouteIndex = 0;

      const next = () => {
        const currentRoute = matchingRoutes[currentRouteIndex];
        currentRouteIndex++;

        currentRoute.handler(req, res, next);
      };

      next();
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  }

  use(path, router) {
    this.routes.push({ method: 'USE', path, handler: router.handleRequest.bind(router) });
  }

  get(path, ...handlers) {
    this.routes.push({ method: 'GET', path, handlers });
  }

  post(path, ...handlers) {
    this.routes.push({ method: 'POST', path, handlers });
  }

  delete(path, ...handlers) {
    this.routes.push({ method: 'DELETE', path, handlers });
  }

  patch(path, ...handlers) {
    this.routes.push({ method: 'PATCH', path, handlers });
  }

  put(path, ...handlers) {
    this.routes.push({ method: 'PUT', path, handlers });
  }
}

export default Router;
