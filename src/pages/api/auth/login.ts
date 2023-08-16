import { sign } from 'jsonwebtoken';

import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// database
import db from 'src/utils/db';

// ----------------------------------------------------------------------

export const JWT_SECRET = process.env.SECRET || "uninex";

export const JWT_EXPIRES_IN = '3 days';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { email, password } = req.body;

    const user = await db.user.findOne({ where: { email }});

    if (!user) {
      res.status(400).json({
        message: 'There is no user corresponding to the email address.',
      });
      return;
    }

    if (user?.password !== password) {
      res.status(400).json({
        message: 'Wrong password',
      });
      return;
    }

    if (user?.isBanned === true) {
      res.status(400).json({
        message: 'Your account has been banned.',
      });
      return;
    }

    if(user?.isVerified === false) {
      res.status(400).json({
        severity: 'warning',
        message: 'Your account has not been verified.',
      });
      return;
    }

    if(user?.isApproved === false) {
      res.status(400).json({
        severity: 'info',
        message: 'Your account has not been approved yet.',
      });
      return;
    }

    const accessToken = sign({ userId: user?.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      accessToken,
      user,
    });
  } catch (error) {
    console.error('[Auth API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
