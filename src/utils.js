const {
	NUMBER_OF_PNG_CHANNELS,
	TELETEXT_CHARACTER_HEIGHT,
	TELETEXT_CHARACTER_WIDTH,
} = require('./consts');

const getPngCoordinatesFromBytePosition = function(pos, width) {
	const byteWidth = width * NUMBER_OF_PNG_CHANNELS;
	return [
		(pos % byteWidth) / NUMBER_OF_PNG_CHANNELS,
		Math.floor(pos / byteWidth),
	];
}

const getMask = (charRow, charCol) =>
	charCol === 1 && charRow === 2 ? 1 << 6 : 1 << (charCol + charRow * 2);

const translatePngCoordinatesToTeletext = (x, y) => [
	Math.floor(y / TELETEXT_CHARACTER_HEIGHT),
	Math.floor(x / TELETEXT_CHARACTER_WIDTH),
];

const getSegmentCoordinates = (x, y) => [
	y % TELETEXT_CHARACTER_HEIGHT,
	x % TELETEXT_CHARACTER_WIDTH,
];

const getTeletextDimensions = (pngWidth, pngHeight) => [
	Math.ceil(pngHeight / TELETEXT_CHARACTER_HEIGHT),
	Math.ceil(pngWidth / TELETEXT_CHARACTER_WIDTH),
];

const getPngHeight = (pngData, width) =>
	Math.ceil(pngData.length / NUMBER_OF_PNG_CHANNELS / width);

module.exports = {
	getPngCoordinatesFromBytePosition,
	getMask,
	translatePngCoordinatesToTeletext,
	getSegmentCoordinates,
	getTeletextDimensions,
	getPngHeight,
};
