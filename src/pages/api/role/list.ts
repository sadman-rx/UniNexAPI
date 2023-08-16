import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// models
import db from 'src/utils/db';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const roles = await db.role.findAll();

    res.status(200).json({
      roles
    });
  } catch (error) {
    console.error('[Roles API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
