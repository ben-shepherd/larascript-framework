/* eslint-disable no-undef */
import { describe } from '@jest/globals';
import HasCastableConcern from '@src/core/concerns/HasCastableConcern';
import CastException from '@src/core/exceptions/CastException';
import { IHasCastableConcern } from '@src/core/interfaces/concerns/IHasCastableConcern';
import { ICtor } from '@src/core/interfaces/ICtor';
import Kernel from '@src/core/Kernel';
import compose from '@src/core/util/compose';
import testAppConfig from '@src/tests/config/testConfig';

describe('HasCastableConcern Tests', () => {
    let castable: IHasCastableConcern;

    beforeAll(async () => {
        await Kernel.boot({
            ...testAppConfig,
            providers: [
                ...testAppConfig.providers,
            ]
        }, {});

        const CastableClass = compose(class {}, HasCastableConcern) as ICtor<IHasCastableConcern>;
        castable = new CastableClass();
    });

    describe('String Casting Tests', () => {
        it('should cast various types to string', () => {
            expect(castable.cast(123, 'string')).toBe('123');
            expect(castable.cast(true, 'string')).toBe('true');
            expect(castable.cast([1, 2, 3], 'string')).toBe('[1,2,3]');
            expect(castable.cast({ a: 1 }, 'string')).toBe('{"a":1}');
            
            const date = new Date('2024-01-01');
            expect(castable.cast(date, 'string')).toBe(date.toISOString());
        });
    });

    describe('Number Casting Tests', () => {
        it('should cast valid values to number', () => {
            expect(castable.cast('123', 'number')).toBe(123);
            expect(castable.cast('123.45', 'number')).toBe(123.45);
            expect(castable.cast(true, 'number')).toBe(1);
            expect(castable.cast(false, 'number')).toBe(0);
        });

        it('should throw CastException for invalid number strings', () => {
            expect(() => castable.cast('abc', 'number')).toThrow(CastException);
        });
    });

    describe('Boolean Casting Tests', () => {
        it('should cast strings to boolean', () => {
            expect(castable.cast('true', 'boolean')).toBe(true);
            expect(castable.cast('false', 'boolean')).toBe(false);
            expect(castable.cast('1', 'boolean')).toBe(true);
            expect(castable.cast('0', 'boolean')).toBe(false);
            expect(castable.cast('yes', 'boolean')).toBe(true);
            expect(castable.cast('no', 'boolean')).toBe(false);
        });

        it('should cast numbers to boolean', () => {
            expect(castable.cast(1, 'boolean')).toBe(true);
            expect(castable.cast(0, 'boolean')).toBe(false);
        });

        it('should throw CastException for invalid boolean strings', () => {
            expect(() => castable.cast('invalid', 'boolean')).toThrow(CastException);
        });
    });

    describe('Array Casting Tests', () => {
        it('should cast to array', () => {
            expect(castable.cast('["a","b"]', 'array')).toEqual(['a', 'b']);
            expect(castable.cast(new Set([1, 2]), 'array')).toEqual([1, 2]);
            expect(castable.cast(123, 'array')).toEqual([123]);
            expect(castable.cast('invalid json', 'array')).toEqual(['invalid json']);
        });
    });

    describe('Object Casting Tests', () => {
        it('should cast to object', () => {
            expect(castable.cast('{"a":1}', 'object')).toEqual({ a: 1 });
            expect(castable.cast([1, 2], 'object')).toEqual({ '0': 1, '1': 2 });
        });

        it('should throw CastException for invalid JSON strings', () => {
            expect(() => castable.cast('invalid json', 'object')).toThrow(CastException);
        });
    });

    describe('Date Casting Tests', () => {
        it('should cast to date', () => {
            const date = new Date('2024-01-01');
            expect(castable.cast('2024-01-01', 'date')).toEqual(date);
            expect(castable.cast(date.getTime(), 'date')).toEqual(date);
            expect(castable.cast(date, 'date')).toEqual(date);
        });

        it('should throw CastException for invalid dates', () => {
            expect(() => castable.cast('invalid date', 'date')).toThrow(CastException);
        });
    });

    describe('Integer Casting Tests', () => {
        it('should cast to integer', () => {
            expect(castable.cast('123', 'integer')).toBe(123);
            expect(castable.cast('123.45', 'integer')).toBe(123);
            expect(castable.cast(123.45, 'integer')).toBe(123);
        });

        it('should throw CastException for invalid integers', () => {
            expect(() => castable.cast('abc', 'integer')).toThrow(CastException);
        });
    });

    describe('Float Casting Tests', () => {
        it('should cast to float', () => {
            expect(castable.cast('123.45', 'float')).toBe(123.45);
            expect(castable.cast(123, 'float')).toBe(123.0);
        });

        it('should throw CastException for invalid floats', () => {
            expect(() => castable.cast('abc', 'float')).toThrow(CastException);
        });
    });

    describe('BigInt Casting Tests', () => {
        it('should cast to BigInt', () => {
            expect(castable.cast('123', 'bigint')).toBe(BigInt(123));
            expect(castable.cast(123, 'bigint')).toBe(BigInt(123));
        });

        it('should throw CastException for invalid BigInt values', () => {
            expect(() => castable.cast('abc', 'bigint')).toThrow(CastException);
            expect(() => castable.cast({}, 'bigint')).toThrow(CastException);
        });
    });

    describe('Map Casting Tests', () => {
        it('should handle Map casting', () => {
            const map = new Map([['a', 1]]);
            expect(castable.cast(map, 'map')).toBe(map);
        });

        it('should throw CastException for invalid Map conversions', () => {
            expect(() => castable.cast({}, 'map')).toThrow(CastException);
        });
    });

    describe('Set Casting Tests', () => {
        it('should cast to Set', () => {
            expect(castable.cast([1, 2, 3], 'set')).toEqual(new Set([1, 2, 3]));
            expect(castable.cast(1, 'set')).toEqual(new Set([1]));
        });
    });

    describe('Symbol Casting Tests', () => {
        it('should cast to Symbol', () => {
            const sym = castable.cast<Symbol>('test', 'symbol')
            expect(typeof sym).toBe('symbol');
            expect(sym.toString()).toBe('Symbol(test)');
        });
    });

    describe('Null and Undefined Handling Tests', () => {
        it('should handle null values correctly', () => {
            expect(castable.cast(null, 'null')).toBeNull();
            expect(() => castable.cast(null, 'string')).toThrow(CastException);
        });

        it('should handle undefined values correctly', () => {
            expect(castable.cast(undefined, 'undefined')).toBeUndefined();
            expect(() => castable.cast(undefined, 'string')).toThrow(CastException);
        });
    });

    describe('Invalid Type Tests', () => {
        it('should throw CastException for invalid types', () => {
            expect(() => castable.cast('test', 'invalid' as any)).toThrow(CastException);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty values', () => {
            expect(castable.cast('', 'string')).toBe('');
            expect(castable.cast([], 'array')).toEqual([]);
            expect(castable.cast({}, 'object')).toEqual({});
        });

        it('should handle special characters', () => {
            expect(castable.cast('§±!@#$%^&*()', 'string')).toBe('§±!@#$%^&*()');
        });
    });
});