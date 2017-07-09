function getMask(charRow: number, charCol: number) {
	return (charCol === 1 && charRow === 2)
		? (1 << 6)
		: 1 << (charCol + (charRow * 2));
}

function getPngCoordinates(i: number, width: number) {
	let widtha = width * 4;
	return [
		Math.floor(i / widtha),
		(i % widtha) / 4
	];
}

function getTeletextCoordinates(pngRow: number, pngCol: number) {
	return [
		Math.floor(pngRow / 3),
		Math.floor(pngCol / 2)
	];
}

function getSegmentCoordinates(pngRow: number, pngCol: number) {
	return [
		pngRow % 3,
		pngCol % 2
	];
}

function create2dArray(rows: number, cols: number, fill) {
	let arr = new Array(rows);
	for (let i = 0; i < rows; i++) {
		arr[i] = new Array(cols).fill(fill);
	}
	return arr;
}

function getTeletextDimensions(pngWidth: number, pngHeight: number) {
	return [
		Math.ceil(pngHeight / 3),
		Math.ceil(pngWidth / 2)
	];
}

function getPngHeight(pngData, width: number) {
	return Math.ceil((pngData.length / 4) / width);
}

export default function png2teletext(graphics, width: number) {
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
	}

	return teletext;
}
