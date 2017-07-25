var rewire = require('rewire'),
	assert = require('assert'),
	png2teletext = rewire('../dist/index.js'),
	create2dArray = png2teletext.__get__('create2dArray');

describe('create2dArray', function() {
	it('should return an array', function() {
		let arr = create2dArray(10, 10, '');
		assert(Array.isArray(arr));
	});

	it('should have the correct length', function() {
		assert(create2dArray(10, 10, '').length, 10);
	});
});
