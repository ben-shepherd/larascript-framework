import Validator from '@src/core/domains/validator/base/Validator';
import Joi from 'joi';

class UserValidator extends Validator {
    rules(): Joi.ObjectSchema<any> {
        return Joi.object({
            username: Joi.string().required().min(3).max(3),
            birth_year: Joi.number().required().min(1900).max(2100),
        })  
    }
}

const UserObjectBad = { username: {}, birth_year: 'bad data' }

const UserObjectGood = { username: 'abc', birth_year: 1994 }

export default Object.freeze({
    UserValidator,
    UserObjectBad,
    UserObjectGood
})