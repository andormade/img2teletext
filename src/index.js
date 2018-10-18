'use strict';

const { getImageHeight } = require('./imageUtils');

const {
	getTeletextDimensions,
	forEachSegment,
	setMosaicCharacterSegment,
} = require('./teletextUtils');

const { TELETEXT_EMPTY_CHARACTER } = require('./consts.js');

const generateTeletextData = function(
	imageBuffer,
	numberOfChannels,
	imageWidth
) {
	const imageHeight = getImageHeight(
		imageBuffer,
		numberOfChannels,
		imageWidth
	);
	const [teletextRows, teletextCols] = getTeletextDimensions(
		imageWidth,
		imageHeight
	);

	const teletextBuffer = new Uint8Array(teletextRows * teletextCols).fill(
		TELETEXT_EMPTY_CHARACTER
	);

	forEachSegment(imageBuffer, numberOfChannels, imageWidth, function(
		teletextRow,
		teletextCol,
		segmentRow,
		segmentCol,
		color
	) {
		const position = teletextRow * teletextCols + teletextCol;
		const character = teletextBuffer[position];
		teletextBuffer[position] =
			color[3] > 0x00
				? setMosaicCharacterSegment(character, segmentRow, segmentCol)
				: character;
	});

	return teletextBuffer;
};

module.exports = function png2teletext(imageBuffer, imageWidth) {
	return generateTeletextData(imageBuffer, 4, imageWidth);
};
