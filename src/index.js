const BLACK = 0x10;
const RED = 0x11;
const GREEN = 0x12;
const YELLOW = 0x13;
const BLUE = 0x14;
const MAGENTA = 0x15;
const CYAN = 0x16;
const WHITE = 0x17;

function getColor(color, defaultColor = WHITE) {
	let [r, g, b] = color;
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

function getMask(charRow, charCol) {
	return (charCol === 1 && charRow === 2)
		? (1 << 6)
		: 1 << (charCol + (charRow * 2));
}

function getPngCoordinates(i, width) {
	let widtha = width * 4;
	return [
		Math.floor(i / widtha),
		(i % widtha) / 4
	];
}

function getTeletextCoordinates(pngRow, pngCol) {
	return [
		Math.floor(pngRow / 3),
		Math.floor(pngCol / 2)
	];
}

function getSegmentCoordinates(pngRow, pngCol) {
	return [
		pngRow % 3,
		pngCol % 2
	];
}

function create2dArray(rows, cols, fill) {
	let arr = new Array(rows);
	for (let i = 0; i < rows; i++) {
		arr[i] = new Array(cols).fill(fill);
	}
	return arr;
}

function getTeletextDimensions(pngWidth, pngHeight) {
	return [
		Math.ceil(pngHeight / 3),
		Math.ceil(pngWidth / 2)
	];
}

function getPngHeight(pngData, width) {
	return Math.ceil((pngData.length / 4) / width);
}

export default function png2teletext(graphics, width, colors = []) {
	let height = getPngHeight(graphics, width);
	let [teletextRows, teletextCols] = getTeletextDimensions(width, height);
	let teletext = create2dArray(teletextRows, teletextCols, 32);

	for (let i = 0; i < graphics.length; i += 4) {
		let [pngRow, pngCol] = getPngCoordinates(i, width);
		let [teletextRow, teletextCol] = getTeletextCoordinates(pngRow, pngCol);
		let [charRow, charCol] = getSegmentCoordinates(pngRow, pngCol);

		/* If the alpha channel is not zero. */
		if (graphics[i + 3] > 0x00) {
			teletext[teletextRow][teletextCol] |= getMask(charRow, charCol);
		}

		if (colors[i + 3] > 0x00) {
			teletext[teletextRow][teletextCol] = getColor(
				colors.slice(i, i + 3));
		}
	}

	return teletext;
}
