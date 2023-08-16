import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

// ----------------------------------------------------------------------

type Middleware = (req: NextApiRequest, res: NextApiResponse, next: (result: any) => void) => void;

const initMiddleware = (middleware: Middleware) => (req: NextApiRequest, res: NextApiResponse) =>
  new Promise<void>((resolve, reject) => {
    middleware(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve();
    });
  });

// ----------------------------------------------------------------------

// Allow only http://localhost:3034
const allowedOrigins = [process.env.APP_URL];

const cors = initMiddleware(
  Cors({
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

export default cors;
