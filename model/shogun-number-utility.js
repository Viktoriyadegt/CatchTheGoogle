/**
 * Utility class for generating random integers within a specified range.
 */
export class ShogunNumberUtility {
    /**
     * Generates a random integer within the specified range.
     *
     * @param {number} fromInclusive - The lower bound of the range (inclusive).
     * @param {number} toExclusive - The upper bound of the range (exclusive).
     * @returns {number} A random integer in the range [fromInclusive, toExclusive).
     * @throws {TypeError} If either argument is not a number.
     * @throws {RangeError} If fromInclusive is not less than toExclusive.
     */
    getRandomIntegerNumber(fromInclusive, toExclusive) {
        // invariant checking
        if (typeof fromInclusive !== 'number' || typeof toExclusive !== 'number') {
            throw new TypeError('Arguments must be numbers');
        }
        if (fromInclusive >= toExclusive) {
            throw new RangeError('fromInclusive must be less than toExclusive');
        }
        return Math.floor(Math.random() * (toExclusive - fromInclusive)) + fromInclusive;
    }
}
