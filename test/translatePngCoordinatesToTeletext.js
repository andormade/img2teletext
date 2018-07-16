var assert = require('assert'),
	Utils = require('../src/utils'),
	translatePngCoordinatesToTeletext = Utils.translatePngCoordinatesToTeletext;

describe('translatePngCoordinatesToTeletext', function() {
	it('should return an array', function() {
		assert(Array.isArray(translatePngCoordinatesToTeletext(10, 10)));
	});

	it('(2, 3) => [1, 1]', function() {
		assert.deepStrictEqual(translatePngCoordinatesToTeletext(2, 3), [1, 1]);
	});
});
