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
} = require('./consts.js');

const getImageHeight = function(imageBuffer, numberOfChannels, width) {
	return Math.ceil(imageBuffer.length / numberOfChannels / width);
};

const forEachPixel = function(imageBuffer, numberOfChannels, width, callback) {
	for (let i = 0; i < imageBuffer.length; i += numberOfChannels) {
		const [x, y] = getPngCoordinatesFromBytePosition(i, width);
		const color = imageBuffer.slice(i, i + numberOfChannels);
		callback(x, y, color);
	}
};

const setMosaicCharacterSegment = function(character, row, col) {
	const mask = col === 1 && row === 2 ? 1 << 6 : 1 << (col + row * 2)
	return (character |= mask);
}

const mapImageData = function(buffer, pngWidth, fill, callback) {
	const height = getImageHeight(buffer, 4, pngWidth);
	const [teletextRows, teletextCols] = getTeletextDimensions(
		pngWidth,
		height
	);

	const map = new Uint8Array(teletextRows * teletextCols).fill(fill);

	forEachPixel(buffer, NUMBER_OF_PNG_CHANNELS, pngWidth, function(
		x,
		y,
		color
	) {
		const [teletextRow, teletextCol] = translatePngCoordinatesToTeletext(
			x,
			y
		);
		const [segmentRow, segmentCol] = getSegmentCoordinates(x, y);

		const character = map[teletextRow * teletextCols + teletextCol];

		map[teletextRow * teletextCols + teletextCol] = callback(
			color,
			character,
			segmentRow,
			segmentCol
		);
	});

	return map;
};

module.exports = function png2teletext(buffer, pngWidth) {
	return mapImageData(
		buffer,
		pngWidth,
		TELETEXT_EMPTY_CHARACTER,
		(color, character, segmentRow, segmentCol) =>
			/* If the alpha channel is not zero. */
			color[3] > 0x00
				? setMosaicCharacterSegment(character, segmentRow, segmentCol)
				: character
	);
};
