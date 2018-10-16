const rewire = require('rewire');
const png2teletext = rewire('../src/index');
const { TELETEXT_COLOR_BLACK } = require('../src/consts');
const assert = require('assert');
const fs = require('fs');
const PNG = require('pngjs').PNG;

const test1 = [
	[32, 48, 96, 112],
	[33, 49, 97, 113],
	[34, 50, 98, 114],
	[35, 51, 99, 115],
	[36, 52, 100, 116],
	[37, 53, 101, 117],
	[38, 54, 102, 118],
	[39, 55, 103, 119],
	[40, 56, 104, 120],
	[41, 57, 105, 121],
	[42, 58, 106, 122],
	[43, 59, 107, 123],
	[44, 60, 108, 124],
	[45, 61, 109, 125],
	[46, 62, 110, 126],
	[47, 63, 111, 127],
];

describe('png2teletext', function() {
	it('should return with the correct teletext data', function() {
		const data = fs.readFileSync('./test/test.png');
		const png = PNG.sync.read(data);
		const teletext = png2teletext(png.data, png.width);

		assert.deepStrictEqual(teletext, test1);
	});
});
