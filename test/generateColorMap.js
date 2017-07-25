var rewire = require('rewire'),
	png2teletext = rewire('../dist/index.js'),
	TELETEXT_COLOR_BLACK = png2teletext.__get__('TELETEXT_COLOR_BLACK'),
	generateColorMap = png2teletext.__get__('generateColorMap'),
	assert = require('assert'),
	fs = require('fs'),
	PNG = require('pngjs').PNG;

const test1 = [
	[null, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK],
	[TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_BLACK]
];

describe('generateColorMap', function() {
	it('should return with the correct colormap', function() {
		let data = fs.readFileSync('./test/test.png'),
			png = PNG.sync.read(data),
			colorMap = generateColorMap(png.data, png.width);

		assert.deepStrictEqual(colorMap, test1);
	});
});