function getMask(charRow: number, charCol: number): number {
	return (charCol === 1 && charRow === 2)
		? (1 << 6)
		: 1 << (charCol + (charRow * 2));
}

function getPngCoordinates(i: number, width: number): array {
	let widtha = width * 4;
	return [
		Math.floor(i / widtha),
		(i % widtha) / 4
	];
}

function getTeletextCoordinates(pngRow: number, pngCol: number): array {
	return [
		Math.floor(pngRow / 3),
		Math.floor(pngCol / 2)
	];
}

function getSegmentCoordinates(pngRow: number, pngCol: number): array {
	return [
		pngRow % 3,
		pngCol % 2
	];
}

function create2dArray(rows: number, cols: number, fill: mixed): array {
	return new Array(rows).fill(null).map(() => {
		return new Array(cols).fill(fill);
	});
}

function getTeletextDimensions(pngWidth: number, pngHeight: number) {
	return [
		Math.ceil(pngHeight / 3),
		Math.ceil(pngWidth / 2)
	];
}

function getPngHeight(pngData: object, width: number): number {
	return Math.ceil((pngData.length / 4) / width);
}

export default function png2teletext(graphics: array, width: number): array {
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
