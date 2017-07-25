import {create2dArray, forEach2d, copy2dArray} from './utils.js';

const TELETEXT_COLOR_BLACK = 0x10;
const TELETEXT_COLOR_RED = 0x11;
const TELETEXT_COLOR_GREEN = 0x12;
const TELETEXT_COLOR_YELLOW = 0x13;
const TELETEXT_COLOR_BLUE = 0x14;
const TELETEXT_COLOR_MAGENTA = 0x15;
const TELETEXT_COLOR_CYAN = 0x16;
const TELETEXT_COLOR_WHITE = 0x17;
const TELETEXT_EMPTY_CHARACTER = 0x20;

const TELETEXT_CHARACTER_WIDTH = 2;
const TELETEXT_CHARACTER_HEIGHT = 3;
const NUMBER_OF_PNG_CHANNELS = 4;

const PNG_CHANNEL_RED = 0;
const PNG_CHANNEL_GREEN = 1;
const PNG_CHANNEL_BLUE = 2;
const PNG_CHANNEL_ALPHA = 3;

function getMask(charRow: number, charCol: number): number {
	return (charCol === 1 && charRow === 2)
		? (1 << 6)
		: 1 << (charCol + (charRow * 2));
}

function getPngCoordinatesFromBytePosition(i: number, width: number): array {
	let byteWidth = width * NUMBER_OF_PNG_CHANNELS;
	return [
		Math.floor(i / byteWidth),
		(i % byteWidth) / NUMBER_OF_PNG_CHANNELS
	];
}

function translatePngCoordinatesToTeletext(pngRow: number, pngCol: number): array {
	return [
		Math.floor(pngRow / TELETEXT_CHARACTER_HEIGHT),
		Math.floor(pngCol / TELETEXT_CHARACTER_WIDTH)
	];
}

function getSegmentCoordinates(pngRow: number, pngCol: number): array {
	return [
		pngRow % TELETEXT_CHARACTER_HEIGHT,
		pngCol % TELETEXT_CHARACTER_WIDTH
	];
}

function getTeletextDimensions(pngWidth: number, pngHeight: number): array {
	return [
		Math.ceil(pngHeight / TELETEXT_CHARACTER_HEIGHT),
		Math.ceil(pngWidth / TELETEXT_CHARACTER_WIDTH)
	];
}

function translateRgbToTeletextColor(r, g, b): void {
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

function getPngHeight(pngData: array, width: number): number {
	return Math.ceil((pngData.length / NUMBER_OF_PNG_CHANNELS) / width);
}

function generateCharacterMap(imageData: array, pngWidth: number): array {
	let height = getPngHeight(imageData, pngWidth),
		[teletextRows, teletextCols] = getTeletextDimensions(pngWidth, height),
		characterMap = create2dArray(teletextRows, teletextCols, TELETEXT_EMPTY_CHARACTER);

	for (let i = 0; i < imageData.length; i += NUMBER_OF_PNG_CHANNELS) {
		let [pngRow, pngCol] = getPngCoordinatesFromBytePosition(i, pngWidth),
			[teletextRow, teletextCol] = translatePngCoordinatesToTeletext(pngRow, pngCol),
			[charRow, charCol] = getSegmentCoordinates(pngRow, pngCol);

		/* If the alpha channel is not zero. */
		if (imageData[i + PNG_CHANNEL_ALPHA] > 0x00) {
			characterMap[teletextRow][teletextCol] |= getMask(charRow, charCol);
		}
	}

	return characterMap;
}

function generateColorMap(imageData: array, pngWidth: number): array {
	let pngHeight = getPngHeight(imageData, pngWidth),
		[teletextRows, teletextCols] = getTeletextDimensions(pngWidth, pngHeight),
		colorMap = create2dArray(teletextRows, teletextCols, null);

	for (let i = 0; i < imageData.length; i += NUMBER_OF_PNG_CHANNELS) {
		let [pngRow, pngCol] = getPngCoordinatesFromBytePosition(i, pngWidth),
			[teletextRow, teletextCol] = translatePngCoordinatesToTeletext(pngRow, pngCol);

		if (imageData[i + PNG_CHANNEL_ALPHA] === 0x00) {
			continue;
		}

		colorMap[teletextRow][teletextCol] = translateRgbToTeletextColor(
			imageData[i + PNG_CHANNEL_RED],
			imageData[i + PNG_CHANNEL_GREEN],
			imageData[i + PNG_CHANNEL_BLUE]
		);
	}

	return colorMap;
}

function mergeColorMapAndCharacterMap(characterMap: array, colorMap: array): array {
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

export default function png2teletext(imageData: array, width: number): array {
	let characterMap = generateCharacterMap(imageData, width),
		colorMap = generateColorMap(imageData, width),
		teletext = mergeColorMapAndCharacterMap(characterMap, colorMap);

	return teletext;
}
