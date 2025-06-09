// src/types/connect-timeout.d.ts
import { RequestHandler } from 'express';

declare module 'connect-timeout' {
  function timeout(ms: string | number): RequestHandler;
  export = timeout;
}

declare namespace Express {
  interface Request {
    timedout?: boolean;
  }
}
