const BLACK = 0x10;
const RED = 0x11;
const GREEN = 0x12;
const YELLOW = 0x13;
const BLUE = 0x14;
const MAGENTA = 0x15;
const CYAN = 0x16;
const WHITE = 0x17;
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
	let widtha = width * NUMBER_OF_PNG_CHANNELS;
	return [
		Math.floor(i / widtha),
		(i % widtha) / NUMBER_OF_PNG_CHANNELS
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

function create2dArray(rows: number, cols: number, filler: mixed): array {
	return new Array(rows).fill(null).map(() => {
		return new Array(cols).fill(filler);
	});
}

function getTeletextDimensions(pngWidth: number, pngHeight: number) {
	return [
		Math.ceil(pngHeight / TELETEXT_CHARACTER_HEIGHT),
		Math.ceil(pngWidth / TELETEXT_CHARACTER_WIDTH)
	];
}

function translateRgbToTeletextColor(r, g, b) {
	switch(true) {
		case (r === 0x00 && g === 0x00 && b === 0x00) : return BLACK;
		case (r === 0xff && g === 0x00 && b === 0x00) : return RED;
		case (r === 0x00 && g === 0xff && b === 0x00) : return GREEN;
		case (r === 0xff && g === 0xff && b === 0x00) : return YELLOW;
		case (r === 0x00 && g === 0x00 && b === 0xff) : return BLUE;
		case (r === 0xff && g === 0x00 && b === 0xff) : return MAGENTA;
		case (r === 0x00 && g === 0xff && b === 0xff) : return CYAN;
		case (r === 0xff && g === 0xff && b === 0xff) : return WHITE;
		default : return defaultColor;
	}
}

function getPngHeight(pngData: array, width: number): number {
	return Math.ceil((pngData.length / NUMBER_OF_PNG_CHANNELS) / width);
}

function generateCharacterMap(imageData: array, pngWidth: number) {
	let height = getPngHeight(imageData, pngWidth);
	let [teletextRows, teletextCols] = getTeletextDimensions(pngWidth, height);
	let characterMap = create2dArray(teletextRows, teletextCols, TELETEXT_EMPTY_CHARACTER);

	for (let i = 0; i < imageData.length; i += NUMBER_OF_PNG_CHANNELS) {
		let [pngRow, pngCol] = getPngCoordinatesFromBytePosition(i, pngWidth);
		let [teletextRow, teletextCol] = translatePngCoordinatesToTeletext(pngRow, pngCol);
		let [charRow, charCol] = getSegmentCoordinates(pngRow, pngCol);

		/* If the alpha channel is not zero. */
		if (imageData[i + PNG_CHANNEL_ALPHA] > 0x00) {
			characterMap[teletextRow][teletextCol] |= getMask(charRow, charCol);
		}
	}

	return characterMap;
}

function generateColorMap(imageData: array, pngWidth: number) {
	let pngHeight = getPngHeight(imageData, pngWidth);
	let [teletextRows, teletextCols] = getTeletextDimensions(pngWidth, pngHeight);
	let colorMap = create2dArray(teletextRows, teletextCols, TELETEXT_EMPTY_CHARACTER);

	for (let i = 0; i < imageData.length; i += NUMBER_OF_PNG_CHANNELS) {
		let [pngRow, pngCol] = getPngCoordinatesFromBytePosition(i, width);
		let [teletextRow, teletextCol] = translatePngCoordinatesToTeletext(pngRow, pngCol);

		colorMap[teletextRow][teletextCol] = translateRgbToTeletextColor(
			imageData[i + PNG_CHANNEL_RED, i + PNG_CHANNEL_GREEN, i + PNG_CHANNEL_BLUE]
		);
	}

	return colorMap;
}

function mergeColorMapAndCharacterMap(characterMap, colorMap) {
	let numRows = characterMap.length;
	let numCols = characterMap[0].length + 1;
	let teletext = this.create2dArray(numRows, numCols, TELETEXT_EMPTY_CHARACTER);

	characterMap.forEach((rowArray, rowNumber) => {
		row.map((char, colNumber) => {
			if (char === TELETEXT_EMPTY_CHARACTER) {
				return colorMap[rowNumber, colNumber];
			}
		});
	});
}

export default function png2teletext(imageData: array, width: number): array {
	return generateCharacterMap(imageData, width);
}
