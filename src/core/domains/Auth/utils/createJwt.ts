import jwt from 'jsonwebtoken'

export default (data: object, expiresIn: string = '1h'): string => {
    const jwtSecret = process.env.JWT_SECRET as string;
    return jwt.sign(data, jwtSecret, { expiresIn })
}