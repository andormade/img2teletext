import {create2dArray, forEach2d, copy2dArray, getMask, getTeletextDimensions,
	translatePngCoordinatesToTeletext, getSegmentCoordinates,
	getPngHeight, getPngCoordinatesFromBytePosition,
	translateRgbToTeletextColor} from './utils.js';

import {TELETEXT_EMPTY_CHARACTER, NUMBER_OF_PNG_CHANNELS, PNG_CHANNEL_ALPHA,
	PNG_CHANNEL_RED, PNG_CHANNEL_GREEN, PNG_CHANNEL_BLUE} from './consts.js';

function generateCharacterMap(imageData, pngWidth) {
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

function generateColorMap(imageData, pngWidth) {
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

export default function png2teletext(imageData, width) {
	let characterMap = generateCharacterMap(imageData, width),
		colorMap = generateColorMap(imageData, width),
		teletext = mergeColorMapAndCharacterMap(characterMap, colorMap);

	return teletext;
}
