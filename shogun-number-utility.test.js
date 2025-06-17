import {ShogunNumberUtility} from "./shogun-number-utility.js";

describe('ShogunNumberUtility', () => {
    const utility = new ShogunNumberUtility();

    test('should generate a number within the given range', () => {
        const fromInclusive = 10;
        const toExclusive = 20;
        const result = utility.getRandomIntegerNumber(fromInclusive, toExclusive);
        expect(result).toBeGreaterThanOrEqual(fromInclusive);
        expect(result).toBeLessThan(toExclusive);
    });

    test('should throw a TypeError if arguments are not numbers', () => {
        expect(() => utility.getRandomIntegerNumber('10', 20)).toThrow(TypeError);
        expect(() => utility.getRandomIntegerNumber(10, '20')).toThrow(TypeError);
    });

    test('should throw a RangeError if fromInclusive is not less than toExclusive', () => {
        expect(() => utility.getRandomIntegerNumber(20, 10)).toThrow(RangeError);
        expect(() => utility.getRandomIntegerNumber(10, 10)).toThrow(RangeError);
    });

    test('should handle edge cases properly', () => {
        // Single value range (e.g., 0 to 1)
        expect(utility.getRandomIntegerNumber(0, 1)).toBe(0);

        // Large range
        const largeFrom = -1000000;
        const largeTo = 1000000;
        const largeResult = utility.getRandomIntegerNumber(largeFrom, largeTo);
        expect(largeResult).toBeGreaterThanOrEqual(largeFrom);
        expect(largeResult).toBeLessThan(largeTo);

        // Negative range
        const negativeFrom = -10;
        const negativeTo = -5;
        const negativeResult = utility.getRandomIntegerNumber(negativeFrom, negativeTo);
        expect(negativeResult).toBeGreaterThanOrEqual(negativeFrom);
        expect(negativeResult).toBeLessThan(negativeTo);
    });
});
