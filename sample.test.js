/**
 * sample function, turns strings into floats
 * @type {function}
 */
const sample = require('./sample');

module.exports = {
	happy
};

/**
 * Tests the "happy" path, where we pass in a numeric string, and sample() gives us back the number
 *
 * @param  {object} test - NodeUnit test object
 */
function happy(test) {
	const random = Math.random();
	const numberAsString = String(random);

	const number = sample(numberAsString);

	test.strictEqual(number, random);

	test.done();
}
