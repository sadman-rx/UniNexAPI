import { NextApiRequest, NextApiResponse } from 'next';
// utils
import db from 'src/utils/db';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      res.status(400).json({
        message: 'Invalid token provided.',
      });
      return;
    }

    const user = await db.user.findOne({ where: { token } });

    if (!user || new Date() > user.tokenExpiry) {
      res.status(400).json({
        message: 'Invalid or expired token.',
      });
      return;
    }

    await db.user.update({ isVerified: true }, { where: { token } });

    res.status(200).send(`
      <html>
      ${user.callbackUrl ? 
      `<head>
        <meta http-equiv="refresh" content="5;url=${process.env.APP_URL}${user.callbackUrl}">
      </head>` : ""
      }
      <body>
        <p>Account verified successfully! ${user.callbackUrl ? `Redirecting in 5 seconds...` : ""}</p>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('[Verify API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
