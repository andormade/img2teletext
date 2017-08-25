var assert = require('assert'),
	Utils = require('../dist/utils.js'),
	translatePngCoordinatesToTeletext = Utils.translatePngCoordinatesToTeletext;

describe('translatePngCoordinatesToTeletext', function() {
	it('should return an array', function() {
		assert(Array.isArray(translatePngCoordinatesToTeletext(10, 10)));
	});

	it('(3, 2) => [1, 1]', function() {
		assert.deepStrictEqual(translatePngCoordinatesToTeletext(3, 2), [1, 1]);
	});
});
