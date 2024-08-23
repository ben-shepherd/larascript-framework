export default class InvalidJWTSecret extends Error {
    constructor(message: string = 'Invalid JWT Secret. Use "yarn run dev -- app:generate-jwt-secret --no --db" to generate a new secret') {
        super(message);
        this.name = 'InvalidJWTSecret';
    }
}