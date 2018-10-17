const {
	getMask,
	getTeletextDimensions,
	translatePngCoordinatesToTeletext,
	getSegmentCoordinates,
	getPngHeight,
	getPngCoordinatesFromBytePosition,
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
	const [teletextRows, teletextCols] = getTeletextDimensions(
		pngWidth,
		height
	);

	const map = new Uint8Array(teletextRows * teletextCols).fill(fill);

	for (let i = 0; i < buffer.length; i += NUMBER_OF_PNG_CHANNELS) {
		const [x, y] = getPngCoordinatesFromBytePosition(i, pngWidth);
		const [teletextRow, teletextCol] = translatePngCoordinatesToTeletext(
			x,
			y
		);
		const [segmentRow, segmentCol] = getSegmentCoordinates(x, y);
		const color = [
			buffer[i + PNG_CHANNEL_RED],
			buffer[i + PNG_CHANNEL_GREEN],
			buffer[i + PNG_CHANNEL_BLUE],
			buffer[i + PNG_CHANNEL_ALPHA],
		];
		const character = map[teletextRow * teletextCols + teletextCol];

		map[teletextRow * teletextCols + teletextCol] = callback(
			color,
			character,
			segmentRow,
			segmentCol
		);
	}

	return map;
};

module.exports = function png2teletext(buffer, pngWidth) {
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
