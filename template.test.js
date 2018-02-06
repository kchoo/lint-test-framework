const FILENAME = require('./FILENAME.js');

module.exports = {
	happy: function (test) {
		const thing = Math.random();

		test.strictEqual(thing, Math.random());

		test.done();
	}
};
