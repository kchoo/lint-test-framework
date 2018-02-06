const sample = require('./sample');

module.exports = {
	happy: function (test) {
		const random = Math.random();
		const numberAsString = String(random);

		const number = sample(numberAsString);

		test.strictEqual(number, random);

		test.done();
	}
};
