/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import AbstractRule from '@src/core/domains/validator/abstract/AbstractRule';
import { IRule } from '@src/core/domains/validator/interfaces/IRule';
import Validator from '@src/core/domains/validator/service/Validator';

class ThrowsExceptionRule extends AbstractRule implements IRule {

    protected name: string = 'throws_exception'

    protected errorTemplate: string = 'This field is invalid.'

    public async test(): Promise<boolean> {
        throw new Error('Test exception')
    }
    
}

describe('test validation rule exception handling', () => {
    
    it('handles thrown exceptions elegantly', async () => {

        const validator = new Validator({
            field: [new ThrowsExceptionRule()]
        })

        const result = await validator.validate({
            field: 'test'
        })

        expect(result.passes()).toBe(false)
        expect(result.errors()).toEqual({
            field: ['Test exception']
        })
    });
}); 