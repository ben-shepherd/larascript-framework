import bcrypt from 'bcryptjs'

export default (password: string, hashedPassword: string): boolean => bcrypt.compareSync(password, hashedPassword)