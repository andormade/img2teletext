var rewire = require('rewire'),
	assert = require('assert'),
	png2teletext = rewire('../dist/index.js'),
	getMask = png2teletext.__get__('getMask'),
	translatePngCoordinatesToTeletext = png2teletext.__get__('translatePngCoordinatesToTeletext'),
	create2dArray = png2teletext.__get__('create2dArray');

require('./integration.js');

describe('getMask', function() {
	it('should return 0x40 if col=1 and row=2', function() {
		assert(getMask(1, 2), 0x40);
	});
});

describe('translatePngCoordinatesToTeletext', function() {
	it('should return an array', function() {
		assert(Array.isArray(translatePngCoordinatesToTeletext(10, 10)));
	});

	it('(3, 2) => [1, 1]', function() {
		assert.deepStrictEqual(translatePngCoordinatesToTeletext(3, 2), [1, 1]);
	});
});

describe('create2dArray', function() {
	it('should return an array', function() {
		let arr = create2dArray(10, 10, '');
		assert(Array.isArray(arr));
	});

	it('should have the correct length', function() {
		assert(create2dArray(10, 10, '').length, 10);
	});
});
