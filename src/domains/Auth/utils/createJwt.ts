import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET as string;

export default (data: object, expiresIn: string = '1h'): string => jwt.sign(data, jwtSecret, { expiresIn })