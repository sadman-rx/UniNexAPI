import { NextApiRequest, NextApiResponse } from 'next';
// utils
import cors from 'src/utils/cors';
// _mock
import { _users, JWT_SECRET, JWT_EXPIRES_IN } from 'src/_mock/_auth';
// database
import db from 'src/utils/db';
import gmail from 'src/utils/gmail';

// ----------------------------------------------------------------------

function hideEmailMiddle(email: string): string {
  const atIndex = email.indexOf('@');

  if (atIndex !== -1) {
    const firstVisible = email.substring(0, 3);
    const middleHidden = "*".repeat(atIndex - 6); // You can adjust the number of hidden characters
    const lastVisible = email.substring(atIndex - 3);
    return `${firstVisible}${middleHidden}${lastVisible}`;
  }

  return email;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await cors(req, res);

    const { roleId, id, email, password, firstName, lastName } = req.body;

    const existUserWithEmail = await db.user.findOne({ where: { email }});
    const existUserWithId = await db.user.findOne({ where: { id } });

    if (existUserWithEmail) {
      res.status(400).json({
        message: 'There already exists an account with the given email address.',
      });
      return;
    }

    if (existUserWithId) {
      res.status(400).json({
        message: `An account with the provided ID already exists. The associated email is ${hideEmailMiddle(existUserWithId.email)}`,
      });
      return;
    }

    const user = {
      id,
      displayName: `${firstName} ${lastName}`,
      email,
      password,
      photoURL: null,
      phoneNumber: null,
      country: null,
      address: null,
      state: null,
      city: null,
      zipCode: null,
      about: null,
      roleId,
      isAdmin: true,
      token: Math.random().toString(36).substr(2),
      tokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
    };

    await db.user.create(user);

    await gmail.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Account Verification Token',
      html: `<p>Hello ${user.displayName},</p><p>Thank you for registering on our site.</p><p>Please use the following token to verify your account:</p><p style="font-size:2em; font-weight:bold;">${user.token}</p><p>This token will expire in 5 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
    });

    res.status(200);
  } catch (error) {
    console.error('[Auth API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
