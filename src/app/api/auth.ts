import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies['auth_token'];
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  return res.status(200).json({ message: 'Token is valid', data: decoded });
}
