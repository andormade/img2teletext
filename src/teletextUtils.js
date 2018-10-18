'use strict';

const {
	TELETEXT_CHARACTER_HEIGHT,
	TELETEXT_CHARACTER_WIDTH,
} = require('./consts');

const { forEachPixel } = require('./imageUtils');

const translateImageCoordinatesToTeletext = function(x, y) {
	return [
		Math.floor(y / TELETEXT_CHARACTER_HEIGHT),
		Math.floor(x / TELETEXT_CHARACTER_WIDTH),
	];
};

const getSegmentCoordinates = function(x, y) {
	return [y % TELETEXT_CHARACTER_HEIGHT, x % TELETEXT_CHARACTER_WIDTH];
};

const getTeletextDimensions = function(pngWidth, pngHeight) {
	return [
		Math.ceil(pngHeight / TELETEXT_CHARACTER_HEIGHT),
		Math.ceil(pngWidth / TELETEXT_CHARACTER_WIDTH),
	];
};

const forEachSegment = function(
	imageBuffer,
	numberOfChannels,
	imageWidth,
	callback
) {
	forEachPixel(imageBuffer, numberOfChannels, imageWidth, function(
		x,
		y,
		color
	) {
		const [teletextRow, teletextCol] = translateImageCoordinatesToTeletext(
			x,
			y
		);
		const [segmentRow, segmentCol] = getSegmentCoordinates(x, y);

		callback(teletextRow, teletextCol, segmentRow, segmentCol, color);
	});
};

const setMosaicCharacterSegment = function(character, row, col) {
	const mask = col === 1 && row === 2 ? 1 << 6 : 1 << (col + row * 2);
	return (character |= mask);
};

module.exports = {
	translateImageCoordinatesToTeletext,
	getSegmentCoordinates,
	getTeletextDimensions,
	forEachSegment,
	setMosaicCharacterSegment,
};
