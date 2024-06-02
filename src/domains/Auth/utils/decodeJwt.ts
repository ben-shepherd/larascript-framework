import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET as string;

export default (token: string): any => jwt.verify(token, jwtSecret)