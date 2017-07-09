var rewire = require('rewire'),
	png2teletext = rewire('../dist/index.js'),
	getTeletextCoordinates = png2teletext.__get__('getTeletextCoordinates')
	assert = require('assert');

describe('getPngCoordinates', () => {
	it('should return an array', () => {
		assert(Array.isArray(getTeletextCoordinates(10, 10)));
	});
});
