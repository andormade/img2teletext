const assert = require('assert');
const { translateImageCoordinatesToTeletext } = require('../src/utils');

describe('translateImageCoordinatesToTeletext', function() {
	it('should return an array', function() {
		assert(Array.isArray(translateImageCoordinatesToTeletext(10, 10)));
	});

	it('(2, 3) => [1, 1]', function() {
		assert.deepStrictEqual(translateImageCoordinatesToTeletext(2, 3), [
			1,
			1,
		]);
	});
});
