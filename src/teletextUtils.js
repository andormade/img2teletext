import {
	TELETEXT_CHARACTER_HEIGHT,
	TELETEXT_CHARACTER_WIDTH,
	TELETEXT_EMPTY_CHARACTER
} from './consts';

import { forEachPixel, getImageHeight } from 'image-buffer-utils';

export const translateImageCoordinatesToTeletext = function(x, y) {
	return [
		Math.floor(y / TELETEXT_CHARACTER_HEIGHT),
		Math.floor(x / TELETEXT_CHARACTER_WIDTH),
	];
};

export const getSegmentCoordinates = function(x, y) {
	return [y % TELETEXT_CHARACTER_HEIGHT, x % TELETEXT_CHARACTER_WIDTH];
};

export const getCharacterCoordinates = function(position, width) {
	const row = Math.floor(position / width);
	const col = position - row * width;
	return [row, col];
};

export const getHeight = function(buffer, width) {
	return Math.ceil(buffer.length / width);
};

export const isCellExitsts = function(row, col, buffer, width) {
	return col < width && row < getHeight(buffer, width);
};

export const getCellPositionInBuffer = function(row, col, buffer, width) {
	return row * width + col;
};

export const getCell = function(row, col, buffer, width) {
	return buffer[getCellPositionInBuffer(row, col, buffer, width)];
};

export const getTeletextDimensions = function(pngWidth, pngHeight) {
	return [
		Math.ceil(pngHeight / TELETEXT_CHARACTER_HEIGHT),
		Math.ceil(pngWidth / TELETEXT_CHARACTER_WIDTH),
	];
};

export const forEachSegment = function(
	imageBuffer,
	numberOfChannels,
	imageWidth,
	callback
) {
	forEachPixel(
		imageBuffer,
		imageWidth,
		function(x, y, color) {
			const [
				teletextRow,
				teletextCol,
			] = translateImageCoordinatesToTeletext(x, y);
			const [segmentRow, segmentCol] = getSegmentCoordinates(x, y);

			callback(teletextRow, teletextCol, segmentRow, segmentCol, color);
		},
		numberOfChannels
	);
};

export const forEachCharacter = function(teletextBuffer, width, callback) {
	for (let i = 0; i < teletextBuffer.length; i++) {
		const [row, col] = getCharacterCoordinates(i, width);
		const character = teletextBuffer[i];
		callback(row, col, character, i);
	}
};

export const fitToTeletextPage = function(teletextBuffer, originalWidth) {
	const cropped = new Uint8Array(25 * 40).fill(TELETEXT_EMPTY_CHARACTER);

	forEachCharacter(cropped, 40, function(row, col) {
		if (isCellExitsts(row, col, teletextBuffer, originalWidth)) {
			const pos = getCellPositionInBuffer(row, col, cropped, 40);
			cropped[pos] = getCell(row, col, teletextBuffer, originalWidth);
		}
	});
	return cropped;
};

export const mapImageToTeletext = function(
	imageBuffer,
	numberOfChannels,
	imageWidth,
	callback
) {
	const imageHeight = getImageHeight(
		imageBuffer,
		imageWidth,
		numberOfChannels
	);
	const [teletextRows, teletextCols] = getTeletextDimensions(
		imageWidth,
		imageHeight
	);

	const teletextBuffer = new Uint8Array(teletextRows * teletextCols).fill(
		TELETEXT_EMPTY_CHARACTER
	);

	forEachSegment(imageBuffer, numberOfChannels, imageWidth, function(
		teletextRow,
		teletextCol,
		segmentRow,
		segmentCol,
		pixel
	) {
		const position = teletextRow * teletextCols + teletextCol;
		const character = teletextBuffer[position];

		teletextBuffer[position] = callback(pixel)
			? setMosaicCharacterSegment(character, segmentRow, segmentCol)
			: character;
	});

	return teletextBuffer;
};

export const setMosaicCharacterSegment = function(character, row, col) {
	const mask = col === 1 && row === 2 ? 1 << 6 : 1 << (col + row * 2);
	return (character |= mask);
};
