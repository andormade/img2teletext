import {NUMBER_OF_PNG_CHANNELS, TELETEXT_COLOR_BLACK, TELETEXT_COLOR_RED,
	TELETEXT_COLOR_GREEN, TELETEXT_COLOR_YELLOW, TELETEXT_COLOR_BLUE,
	TELETEXT_COLOR_MAGENTA, TELETEXT_COLOR_CYAN, TELETEXT_COLOR_WHITE,
	TELETEXT_CHARACTER_HEIGHT, TELETEXT_CHARACTER_WIDTH} from './consts.js';

export function create2dArray(rows, cols, filler) {
	return new Array(rows).fill(null).map(() => {
		return new Array(cols).fill(filler);
	});
}

export function forEach2d(arr, callback) {
	for (let row = 0; row < arr.length; row++) {
		for (let col = 0; col < arr[row].length; col++) {
			callback(row, col);
		}
	}
}

export function copy2dArray(arr) {
	let newArr = [];
	for (let row = 0; row < arr.length; row++) {
		newArr[row] = [...arr[row]];
	}
	return newArr;
}

export function getPngCoordinatesFromBytePosition(i, width) {
	let byteWidth = width * NUMBER_OF_PNG_CHANNELS;
	return [
		Math.floor(i / byteWidth),
		(i % byteWidth) / NUMBER_OF_PNG_CHANNELS
	];
}

export function translateRgbToTeletextColor(r, g, b) {
	switch(true) {
		case (r === 0x00 && g === 0x00 && b === 0x00) : return TELETEXT_COLOR_BLACK;
		case (r === 0xff && g === 0x00 && b === 0x00) : return TELETEXT_COLOR_RED;
		case (r === 0x00 && g === 0xff && b === 0x00) : return TELETEXT_COLOR_GREEN;
		case (r === 0xff && g === 0xff && b === 0x00) : return TELETEXT_COLOR_YELLOW;
		case (r === 0x00 && g === 0x00 && b === 0xff) : return TELETEXT_COLOR_BLUE;
		case (r === 0xff && g === 0x00 && b === 0xff) : return TELETEXT_COLOR_MAGENTA;
		case (r === 0x00 && g === 0xff && b === 0xff) : return TELETEXT_COLOR_CYAN;
		case (r === 0xff && g === 0xff && b === 0xff) : return TELETEXT_COLOR_WHITE;
		default : return TELETEXT_COLOR_WHITE;
	}
}

export const getMask = (charRow, charCol) => (
	(charCol === 1 && charRow === 2)
		? (1 << 6)
		: 1 << (charCol + (charRow * 2))
);

export const translatePngCoordinatesToTeletext = (pngRow, pngCol) => ([
	Math.floor(pngRow / TELETEXT_CHARACTER_HEIGHT),
	Math.floor(pngCol / TELETEXT_CHARACTER_WIDTH)
]);

export const getSegmentCoordinates = (pngRow, pngCol) => ([
	pngRow % TELETEXT_CHARACTER_HEIGHT,
	pngCol % TELETEXT_CHARACTER_WIDTH
]);

export const getTeletextDimensions = (pngWidth, pngHeight) => ([
	Math.ceil(pngHeight / TELETEXT_CHARACTER_HEIGHT),
	Math.ceil(pngWidth / TELETEXT_CHARACTER_WIDTH)
]);

export const getPngHeight = (pngData, width) => (
	Math.ceil((pngData.length / NUMBER_OF_PNG_CHANNELS) / width)
);
