import { describe, expect, test } from '@jest/globals';
import BaseSimpleRegister from '@src/core/base/BaseSimpleRegister';

class TestSimpleClass extends BaseSimpleRegister {}

describe('test simple register', () => {


    test('test multiple lists', async () => {

        const test = new TestSimpleClass();
        
        test.srCreateList('cities', new Map([
            ['London', 1],
            ['New York', 2],
            ['Paris', 3],
        ]));

        expect(test.srListExists('cities')).toBeTruthy();

        expect(test.srGetList('cities').size).toBe(3);
        expect(test.srGetList('cities').get('London')).toBe(1);
        expect(test.srGetList('cities').get('New York')).toBe(2);
        expect(test.srGetList('cities').get('Paris')).toBe(3);

        test.srCreateList('populations', new Map([
            ['London', 1000000],
            ['New York', 2000000],
            ['Paris', 3000000],
        ]));

        expect(test.srListExists('populations')).toBeTruthy();
        expect(test.srGetList('populations').size).toBe(3);
        expect(test.srGetList('populations').get('London')).toBe(1000000);
        expect(test.srGetList('populations').get('New York')).toBe(2000000);
        expect(test.srGetList('populations').get('Paris')).toBe(3000000);

        test.srDeleteList('cities');
        expect(test.srGetList('cities') instanceof Map).toBeFalsy();

        test.srDeleteList('populations');
        expect(test.srGetList('populations') instanceof Map).toBeFalsy();
    })

    test('test setting and getting values', async () => {

        const test = new TestSimpleClass();

        test.srCreateList('cities', new Map([
            ['London', 1],
            ['New York', 2],
            ['Paris', 3],
        ]));
        test.srCreateList('animals', new Map([
            ['dog', 1],
            ['cat', 2],
            ['mouse', 3],
        ]))

        expect(test.srGetValue('London', 'cities')).toBe(1);
        expect(test.srGetValue('New York', 'cities')).toBe(2);
        expect(test.srGetValue('Paris', 'cities')).toBe(3);
        expect(test.srGetList('cities').size).toBe(3);

        expect(test.srGetValue('dog', 'animals')).toBe(1);
        expect(test.srGetValue('cat', 'animals')).toBe(2);
        expect(test.srGetValue('mouse', 'animals')).toBe(3);
        expect(test.srGetList('animals').size).toBe(3);

        test.srSetValue('London', 1000000, 'cities');
        test.srSetValue('New York', 2000000, 'cities');
        test.srSetValue('Paris', 3000000, 'cities');

        expect(test.srGetValue('London', 'cities')).toBe(1000000);
        expect(test.srGetValue('New York', 'cities')).toBe(2000000);
        expect(test.srGetValue('Paris', 'cities')).toBe(3000000);

        test.srSetValue('cat', 1000, 'animals');
        test.srSetValue('dog', 2000, 'animals');
        test.srSetValue('mouse', 3000, 'animals');

        expect(test.srGetValue('cat', 'animals')).toBe(1000);
        expect(test.srGetValue('dog', 'animals')).toBe(2000);
        expect(test.srGetValue('mouse', 'animals')).toBe(3000);

        test.srClearList('cities')
        test.srClearList('animals')

        expect(test.srGetValue('London', 'cities')).toBeUndefined();
        expect(test.srGetValue('New York', 'cities')).toBeUndefined();
        expect(test.srGetValue('Paris', 'cities')).toBeUndefined();

        expect(test.srGetValue('cat', 'animals')).toBeUndefined();
        expect(test.srGetValue('dog', 'animals')).toBeUndefined();
        expect(test.srGetValue('mouse', 'animals')).toBeUndefined();
    })

    test('test sad flow', () => {

        const test = new TestSimpleClass();

        // No list created
        expect(test.srGetValue('London', 'cities')).toBeUndefined();
        expect(test.srHasValue('London', 'cities')).toBeFalsy();
        expect(test.srSetValue('London', 1000000, 'cities')).toBeFalsy();
        expect(test.srClearList('cities')).toBeFalsy();
        expect(test.srDeleteList('cities')).toBeFalsy();
    })

});