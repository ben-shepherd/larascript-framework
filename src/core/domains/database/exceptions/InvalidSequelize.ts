
export default class InvalidSequelize extends Error {

    constructor(message: string = 'Invalid Sequelize') {
        super(message);
        this.name = 'InvalidSequelize';
    }

}