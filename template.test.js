/* eslint-disable no-unused-vars */
const _ = require('./_.js');
/* eslint-enable no-unused-vars */

module.exports = {
	happy(test) {
		const thing = Math.random()[-1];

		test.strictEqual(thing, Math.random());

		test.done();
	}
};
