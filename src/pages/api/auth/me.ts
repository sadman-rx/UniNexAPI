import { verify } from 'jsonwebtoken';

import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// database
import db from 'src/utils/db';

// ----------------------------------------------------------------------

export const JWT_SECRET = process.env.SECRET || "uninex";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({
        message: 'Authorization token missing',
      });
      return;
    }

    const accessToken = `${authorization}`.split(' ')[1];

    const data = verify(accessToken, JWT_SECRET);

    const userId = typeof data === 'object' ? data?.userId : '';

    const user = await db.user.findOne({ where: { id: userId } });

    if (!user) {
      res.status(401).json({
        message: 'Invalid authorization token',
      });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('[Auth API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
