/**
 * sample function, turns strings into floats
 * @type {function}
 */
const sample = require('./sample');

module.exports = {
	happy
};

/**
 * @param  {object} test - NodeUnit test object
 * @return {void}
 */
function happy(test) {
	const random = Math.random();
	const numberAsString = String(random);

	const number = sample(numberAsString);

	test.strictEqual(number, random);

	test.done();
}
