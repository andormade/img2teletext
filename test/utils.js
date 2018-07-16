const assert = require('assert');
const { create2dArray } = require('../src/utils');
const { copy2dArray } = require('../src/utils');

describe('create2dArray', function() {
	it('should return an array', function() {
		let arr = create2dArray(10, 10, '');
		assert(Array.isArray(arr));
	});

	it('should have the correct length', function() {
		assert(create2dArray(10, 10, '').length, 10);
	});
});

describe('copy2dArray', function() {
	it('should return an array', function() {
		let arr = copy2dArray([[1, 2], [3, 4]]);
		assert(Array.isArray(arr));
	});
});
