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
      token: [...Array(32)].map(() => Math.random().toString(36).replace(/[^a-z0-9]+/g, '').substr(0, 1)).join(''),
      tokenExpiry: new Date(Date.now() + 5 * 60 * 1000),
    };

    await db.user.create(user);

    const verificationLink = `${process.env.NODE_ENV === 'development' ? process.env.DEV_API : process.env.PRODUCTION_API}/api/auth/verify?token=${user.token}`;

    await gmail.sendMail({
      from: `UniNex <${process.env.EMAIL_ADDRESS}>`,
      to: user.email,
      subject: 'Please verify your UniNex account',
      html: `<p>Dear ${user.displayName},</p>
      <p>Thank you for showing your internest in joining UniNex! To ensure the security of your account and complete the registration process, we need to verify your email address.</p>
      <p>Please click on the following link to verify your account:</p>
      <a href="${verificationLink}" style="padding: 5px 10px; background: #fda92d; color: #161C24; font-size: 1.5em; font-weight: bold; text-decoration: none; border-radius: 0.25em;">Verify Account</a>
      <p>If the link above does not work, you can copy and paste the URL into your browser's address bar: ${verificationLink}</p>
      <p>Please note that this link is valid for the next 5 minutes. After that, you may need to request a new verification link.</p>
      <p>If you did not create an account with UniNex, please ignore this email.</p>
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:sadmanhossainwork@gmail.com">sadmanhossainwork@gmail.com</a>.</p>
      <p>Thank you for choosing UniNex. We look forward to providing you with a great experience!</p>
      <p>Best regards,<br>The UniNex Team</p>`,
    });

    res.status(200).end();
  } catch (error) {
    console.error('[Auth API]: ', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}
