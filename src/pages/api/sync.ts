import { NextApiRequest, NextApiResponse } from 'next';
import cors from 'src/utils/cors';
import db from 'src/utils/db';

// ----------------------------------------------------------------------

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    await db.sequelize.sync({ force: true });

    await db.role.bulkCreate([
      { value: 'student', label: 'Student', icon: 'mdi:account-school-outline', requireUIUEmail: true },
      { value: 'faculty', label: 'Faculty', icon: 'mdi-account-group', requireUIUEmail: true },
      { value: 'alumni', label: 'Alumni', icon: 'mdi:account-group-outline', requireUIUEmail: false },
    ]);

    res.status(200).json({
      message: 'Models synchronized successfully with MySQL.',
    });
  } catch (error) {
    console.error('[Sync API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
