const rewire = require('rewire');
const assert = require('assert');
const { getMask } = rewire('../src/utils');

describe('getMask', function() {
	it('should return 0x40 if col=1 and row=2', function() {
		assert(getMask(1, 2), 0x40);
	});
});
