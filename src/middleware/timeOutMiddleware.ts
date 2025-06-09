import timeout from 'connect-timeout';
import { Request as ExpressRequest, Response, NextFunction } from 'express';

// Extiendo Request con la propiedad timedout
interface Request extends ExpressRequest {
  timedout?: boolean;
}

export const applyTimeout = timeout('180s');

export function haltOnTimedout(req: Request, res: Response, next: NextFunction) {
  if (!req.timedout) next();
}
