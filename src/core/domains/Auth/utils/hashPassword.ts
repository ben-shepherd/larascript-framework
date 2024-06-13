import bcryptjs from 'bcryptjs'

export default (password: string, salt: number = 10): string => bcryptjs.hashSync(password, salt)

