import jwt from 'jsonwebtoken'

export default (token: string): any => {
    const jwtSecret = process.env.JWT_SECRET as string;
    jwt.verify(token, jwtSecret)
}