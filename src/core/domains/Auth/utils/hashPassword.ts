import bcryptjs from 'bcryptjs'

/**
 * Hashes a password using bcryptjs with a given salt (default is 10)
 * @param password The password to hash
 * @param salt The salt to use for hashing (optional, default is 10)
 * @returns The hashed password
 */
export default (password: string, salt: number = 10): string => bcryptjs.hashSync(password, salt)

