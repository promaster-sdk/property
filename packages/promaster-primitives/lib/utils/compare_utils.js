"use strict";
/**
 * Compare two numbers with same or different number of decimals. If
 * the numbers have different amount of decimals they are both "padded"
 * to use the same number as the one with the most decimals.
 *
 * @param  {number} first          - First number to compare.
 * @param  {number} second         - Second number to compare.
 * @param  {number} firstDecimals  - Number of decimals for first number.
 * @param  {number} secondDecimals - Number of decimals for second number.
 * @return {number}                - 0, -1 or 1 depending on if the numbers are
 *                                      0  = equal
 *                                      -1 = first < second
 *                                      1  = second > first
 *
 */
function compareNumbers(first, second, firstDecimals, secondDecimals) {
    var d = Math.max(firstDecimals, secondDecimals); // use the highest number of decimals
    var f = Math.round(first * Math.pow(10, d));
    var s = Math.round(second * Math.pow(10, d));
    if (f === s)
        return 0;
    if (f < s)
        return -1;
    else
        return 1;
}
exports.compareNumbers = compareNumbers;
function compareIgnoreCase(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
}
exports.compareIgnoreCase = compareIgnoreCase;
function arraysEqual(array1, array2) {
    // if the other array is a falsy value, return
    if (!array2)
        return false;
    // compare lengths - can save a lot of time
    if (array1.length !== array2.length)
        return false;
    for (var i = 0, l = array1.length; i < l; i++) {
        // Check if we have nested arrays
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            // recurse into the nested arrays
            if (!arraysEqual(array1[i], array2[i]))
                return false;
        }
        else if (array1[i] !== array2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
exports.arraysEqual = arraysEqual;
//# sourceMappingURL=compare_utils.js.map