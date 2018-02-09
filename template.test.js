/* eslint-disable no-unused-vars */
const _ = require('./_.js');
/* eslint-enable no-unused-vars */

module.exports = {
	happy(test) {
		const thing = Math.random();

		test.strictEqual(thing, Math.random());

		test.done();
	}
};
