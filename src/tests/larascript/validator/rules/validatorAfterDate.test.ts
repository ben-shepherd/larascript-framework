import { describe, expect, it } from '@jest/globals';
import AfterDateRule from '@src/core/domains/validator/rules/AfterDateRule';
import Validator from '@src/core/domains/validator/service/Validator';

describe('test after date validation rule', () => {
    it('should pass when value is after the specified date', async () => {
        const referenceDate = new Date('2024-01-01');
        const validator = Validator.make({
            field: [new AfterDateRule({ date: referenceDate })]
        });

        const result = validator.validate({
            field: new Date('2024-02-01')
        });
        expect((await result).passes()).toBe(true);
    });

    it('should fail when value is before the specified date', async () => {
        const referenceDate = new Date('2024-01-01');
        const validator = Validator.make({
            field: [new AfterDateRule({ date: referenceDate })]
        });

        const result = validator.validate({
            field: new Date('2023-12-31')
        });
        expect((await result).passes()).toBe(false);
    });

    it('should pass when value is a well formatted date string', async () => {
        const referenceDate = new Date('2024-01-01');
        const validator = Validator.make({
            field: [new AfterDateRule({ date: referenceDate })]
        });

        const result = validator.validate({
            field: '2024-02-01'
        });
        expect((await result).passes()).toBe(true);
    });

    it('should fail when value is a poorly formatted date string', async () => {
        const referenceDate = new Date('2024-01-01');
        const validator = Validator.make({
            field: [new AfterDateRule({ date: referenceDate })]
        });

        const result = validator.validate({
            field: '01-02-2024'
        });
        expect((await result).passes()).toBe(false);
    });

    it('should fail when value is not a Date instance', async () => {
        const referenceDate = new Date('2024-01-01');
        const validator = Validator.make({
            field: [new AfterDateRule({ date: referenceDate })]
        });

        const result = validator.validate({
            field: 123
        });
        expect((await result).passes()).toBe(false);
    });

    it('should pass when attribute is provided to check another date field', async () => {
        const referenceDate = new Date('2024-01-01');
        const validator = Validator.make({
            field: [new AfterDateRule({ date: referenceDate, attribute: 'otherDate' })]
        });

        const result = validator.validate({
            field: referenceDate,
            otherDate: new Date('2024-02-01')
        });
        expect((await result).passes()).toBe(true);
    });
}); 