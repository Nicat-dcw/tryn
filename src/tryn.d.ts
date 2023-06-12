declare module 'tryn' {
  import { IncomingMessage, ServerResponse } from 'http';

  type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void;

  export class Prettier {
    constructor();
    pretty(data: any): string;
  }

  interface Route {
    method: string;
    path: string;
    handler: RequestHandler;
  }

  interface Middleware {
    (req: IncomingMessage, res: ServerResponse): void;
  }

  interface ServerOptions {
    port?: number;
    prettier?: Prettier;
  }

  export class Server {
    constructor(options: ServerOptions);
    use(middleware: Middleware): void;
    get(path: string, handler: RequestHandler): void;
    post(path: string, handler: RequestHandler): void;
    delete(path: string, handler: RequestHandler): void;
    patch(path: string, handler: RequestHandler): void;
    put(path: string, handler: RequestHandler): void;
    close(callback?: () => void): void;
  }
}