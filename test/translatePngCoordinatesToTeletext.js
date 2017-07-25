var rewire = require('rewire'),
	assert = require('assert'),
	png2teletext = rewire('../dist/index.js'),
	translatePngCoordinatesToTeletext = png2teletext.__get__('translatePngCoordinatesToTeletext');

describe('translatePngCoordinatesToTeletext', function() {
	it('should return an array', function() {
		assert(Array.isArray(translatePngCoordinatesToTeletext(10, 10)));
	});

	it('(3, 2) => [1, 1]', function() {
		assert.deepStrictEqual(translatePngCoordinatesToTeletext(3, 2), [1, 1]);
	});
});
