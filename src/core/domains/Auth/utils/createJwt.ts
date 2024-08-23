import jwt from 'jsonwebtoken'

export default (secret: string, data: object, expiresIn: string = '1h'): string => {
    return jwt.sign(data, secret, { expiresIn })
}