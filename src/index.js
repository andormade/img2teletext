const {
	create2dArray,
	forEach2d,
	copy2dArray,
	getMask,
	getTeletextDimensions,
	translatePngCoordinatesToTeletext,
	getSegmentCoordinates,
	getPngHeight,
	getPngCoordinatesFromBytePosition,
	translateRgbToTeletextColor,
} = require('./utils');

const {
	TELETEXT_EMPTY_CHARACTER,
	NUMBER_OF_PNG_CHANNELS,
	PNG_CHANNEL_ALPHA,
	PNG_CHANNEL_RED,
	PNG_CHANNEL_GREEN,
	PNG_CHANNEL_BLUE,
} = require('./consts.js');

const mapImageData = function(buffer, pngWidth, fill, callback) {
	const height = getPngHeight(buffer, pngWidth);
	const [teletextRows, teletextCols] = getTeletextDimensions(pngWidth, height);
	const map = create2dArray(teletextRows, teletextCols, fill);

	for (let i = 0; i < buffer.length; i += NUMBER_OF_PNG_CHANNELS) {
		const [x, y] = getPngCoordinatesFromBytePosition(i, pngWidth);
		const [teletextRow, teletextCol] = translatePngCoordinatesToTeletext(x, y);
		const [segmentRow, segmentCol] = getSegmentCoordinates(x, y);
		const color = [
			buffer[i + PNG_CHANNEL_RED],
			buffer[i + PNG_CHANNEL_GREEN],
			buffer[i + PNG_CHANNEL_BLUE],
			buffer[i + PNG_CHANNEL_ALPHA],
		];
		const character = map[teletextRow][teletextCol];

		map[teletextRow][teletextCol] = callback(
			color,
			character,
			segmentRow,
			segmentCol
		);
	}

	return map;
};

const generateCharacterMap = function(buffer, pngWidth) {
	return mapImageData(
		buffer,
		pngWidth,
		TELETEXT_EMPTY_CHARACTER,
		(color, character, segmentRow, segmentCol) =>
			/* If the alpha channel is not zero. */
			color[PNG_CHANNEL_ALPHA] > 0x00
				? (character |= getMask(segmentRow, segmentCol))
				: character
	);
};

const generateColorMap = function(buffer, pngWidth) {
	return mapImageData(
		buffer,
		pngWidth,
		null,
		(color, character) =>
			color[PNG_CHANNEL_ALPHA] === 0x00
				? character
				: translateRgbToTeletextColor(color)
	);
};

const mergeColorMapAndCharacterMap = function(characterMap, colorMap) {
	const teletext = copy2dArray(characterMap);

	forEach2d(teletext, (row, col) => {
		if (
			teletext[row][col] === TELETEXT_EMPTY_CHARACTER &&
			colorMap[row][col + 1]
		) {
			teletext[row][col] = colorMap[row][col + 1];
		}
	});

	return teletext;
};

module.exports = function png2teletext(imageBuffer, width) {
	return mergeColorMapAndCharacterMap(
		generateCharacterMap(imageBuffer, width),
		generateColorMap(imageBuffer, width)
	);
};
