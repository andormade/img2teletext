const {create2dArray, forEach2d, copy2dArray, getMask, getTeletextDimensions,
	translatePngCoordinatesToTeletext, getSegmentCoordinates,
	getPngHeight, getPngCoordinatesFromBytePosition,
	translateRgbToTeletextColor} = require('./utils');

const {TELETEXT_EMPTY_CHARACTER, NUMBER_OF_PNG_CHANNELS, PNG_CHANNEL_ALPHA,
	PNG_CHANNEL_RED, PNG_CHANNEL_GREEN, PNG_CHANNEL_BLUE} = require('./consts.js');


function mapImageData(buffer, pngWidth, fill, callback) {
	let height = getPngHeight(buffer, pngWidth);
	let [teletextRows, teletextCols] = getTeletextDimensions(pngWidth, height);
	let map = create2dArray(teletextRows, teletextCols, fill);

	for (let i = 0; i < buffer.length; i += NUMBER_OF_PNG_CHANNELS) {
		let [x, y] = getPngCoordinatesFromBytePosition(i, pngWidth);
		let [teletextRow, teletextCol] = translatePngCoordinatesToTeletext(x, y);
		let [segmentRow, segmentCol] = getSegmentCoordinates(x, y);
		let color = [
			buffer[i + PNG_CHANNEL_RED],
			buffer[i + PNG_CHANNEL_GREEN],
			buffer[i + PNG_CHANNEL_BLUE],
			buffer[i + PNG_CHANNEL_ALPHA]
		];
		let character = map[teletextRow][teletextCol];

		map[teletextRow][teletextCol] =
			callback(color, character, segmentRow, segmentCol);
	}

	return map;
}


function generateCharacterMap(buffer, pngWidth) {
	return mapImageData(buffer, pngWidth, TELETEXT_EMPTY_CHARACTER,
		(color, character, segmentRow, segmentCol) => (
			/* If the alpha channel is not zero. */
			(color[PNG_CHANNEL_ALPHA] > 0x00) ?
				character |= getMask(segmentRow, segmentCol) : character
		)
	);
}

function generateColorMap(buffer, pngWidth) {
	return mapImageData(buffer, pngWidth, null, (color, character) => (
		(color[PNG_CHANNEL_ALPHA] === 0x00) ?
			character : translateRgbToTeletextColor(color)
	));
}

function mergeColorMapAndCharacterMap(characterMap, colorMap) {
	let numRows = characterMap.length,
		numCols = characterMap[0].length,
		teletext = copy2dArray(characterMap);

	forEach2d(teletext, (row, col) => {
		if (
			teletext[row][col] === TELETEXT_EMPTY_CHARACTER &&
			colorMap[row][col + 1]
		) {
			teletext[row][col] = colorMap[row][col + 1];
		}
	});

	return teletext;
}

module.exports = function png2teletext(imageBuffer, width) {
	return mergeColorMapAndCharacterMap(
		generateCharacterMap(imageBuffer, width),
		generateColorMap(imageBuffer, width)
	);
}
