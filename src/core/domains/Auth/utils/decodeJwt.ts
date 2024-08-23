import jwt from 'jsonwebtoken'

export default (secret: string, token: string): any => {
    return jwt.verify(token, secret)
}