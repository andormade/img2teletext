var rewire = require('rewire'),
	assert = require('assert'),
	png2teletext = rewire('../dist/index.js'),
	getMask = png2teletext.__get__('getMask');

describe('getMask', function() {
	it('should return 0x40 if col=1 and row=2', function() {
		assert(getMask(1, 2), 0x40);
	});
});
