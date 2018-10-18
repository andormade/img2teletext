const {
	getTeletextDimensions,
	translateImageCoordinatesToTeletext,
	getSegmentCoordinates,
	getImageCoordinatesFromBytePosition,
} = require('./utils');

const {
	TELETEXT_EMPTY_CHARACTER,
	NUMBER_OF_PNG_CHANNELS,
} = require('./consts.js');

const getImageHeight = function(imageBuffer, numberOfChannels, width) {
	return Math.ceil(imageBuffer.length / numberOfChannels / width);
};

const forEachPixel = function(imageBuffer, numberOfChannels, width, callback) {
	for (let i = 0; i < imageBuffer.length; i += numberOfChannels) {
		const [x, y] = getImageCoordinatesFromBytePosition(i, width);
		const color = imageBuffer.slice(i, i + numberOfChannels);
		callback(x, y, color);
	}
};

const forEachSegment = function(
	imageBuffer,
	numberOfChannels,
	width,
	callback
) {
	forEachPixel(imageBuffer, numberOfChannels, width, function(x, y, color) {
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

const generateTeletextData = function(buffer, imageWidth, callback) {
	const imageHeight = getImageHeight(buffer, 4, imageWidth);
	const [teletextRows, teletextCols] = getTeletextDimensions(
		imageWidth,
		imageHeight
	);

	const teletextData = new Uint8Array(teletextRows * teletextCols).fill(
		TELETEXT_EMPTY_CHARACTER
	);

	forEachSegment(buffer, NUMBER_OF_PNG_CHANNELS, imageWidth, function(
		teletextRow,
		teletextCol,
		segmentRow,
		segmentCol,
		color
	) {
		const position = teletextRow * teletextCols + teletextCol;
		const character = map[position];
		teletextData[position] =
			color[3] > 0x00
				? setMosaicCharacterSegment(character, segmentRow, segmentCol)
				: character;
	});

	return teletextData;
};

module.exports = function png2teletext(buffer, pngWidth) {
	return generateTeletextData(buffer, pngWidth);
};
