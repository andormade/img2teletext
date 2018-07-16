const {
	NUMBER_OF_PNG_CHANNELS,
	TELETEXT_COLOR_BLACK,
	TELETEXT_COLOR_RED,
	TELETEXT_COLOR_GREEN,
	TELETEXT_COLOR_YELLOW,
	TELETEXT_COLOR_BLUE,
	TELETEXT_COLOR_MAGENTA,
	TELETEXT_COLOR_CYAN,
	TELETEXT_COLOR_WHITE,
	TELETEXT_CHARACTER_HEIGHT,
	TELETEXT_CHARACTER_WIDTH,
} = require('./consts');

function create2dArray(rows, cols, filler) {
	return new Array(rows).fill(null).map(() => {
		return new Array(cols).fill(filler);
	});
}

function forEach2d(arr, callback) {
	for (let row = 0; row < arr.length; row++) {
		for (let col = 0; col < arr[row].length; col++) {
			callback(row, col);
		}
	}
}

function copy2dArray(arr) {
	let newArr = [];
	for (let row = 0; row < arr.length; row++) {
		newArr[row] = [...arr[row]];
	}
	return newArr;
}

function getPngCoordinatesFromBytePosition(pos, width) {
	let byteWidth = width * NUMBER_OF_PNG_CHANNELS;
	return [
		(pos % byteWidth) / NUMBER_OF_PNG_CHANNELS,
		Math.floor(pos / byteWidth),
	];
}

function translateRgbToTeletextColor(color) {
	let [r, g, b] = color;
	switch (true) {
		case r === 0x00 && g === 0x00 && b === 0x00:
			return TELETEXT_COLOR_BLACK;
		case r === 0xff && g === 0x00 && b === 0x00:
			return TELETEXT_COLOR_RED;
		case r === 0x00 && g === 0xff && b === 0x00:
			return TELETEXT_COLOR_GREEN;
		case r === 0xff && g === 0xff && b === 0x00:
			return TELETEXT_COLOR_YELLOW;
		case r === 0x00 && g === 0x00 && b === 0xff:
			return TELETEXT_COLOR_BLUE;
		case r === 0xff && g === 0x00 && b === 0xff:
			return TELETEXT_COLOR_MAGENTA;
		case r === 0x00 && g === 0xff && b === 0xff:
			return TELETEXT_COLOR_CYAN;
		case r === 0xff && g === 0xff && b === 0xff:
			return TELETEXT_COLOR_WHITE;
		default:
			return TELETEXT_COLOR_WHITE;
	}
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
	create2dArray,
	forEach2d,
	copy2dArray,
	getPngCoordinatesFromBytePosition,
	translateRgbToTeletextColor,
	getMask,
	translatePngCoordinatesToTeletext,
	getSegmentCoordinates,
	getTeletextDimensions,
	getPngHeight,
};
