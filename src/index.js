export default function png2teletext(pngData, width) {
	width = width * 4;
	let teletext = [];
	for (let i = 0; i < pngData.length; i += 4) {
		/* Coordinates of the current pixel on the image. */
		let pngRow = Math.floor(i / width);
		let pngCol = (i % width) / 4;
		/* Coordinates of the teletext characher. */
		let teletextRow = Math.floor(pngRow / 3);
		let teletextCol = Math.floor(pngCol / 2);
		/* Coordinates of the segment inside the teletext character. */
		let charRow = pngRow % 3;
		let charCol = pngCol % 2;

		/* If it doesn't exist. */
		if (!teletext[teletextRow]) {
			teletext[teletextRow] = [];
		}
		if (!teletext[teletextRow][teletextCol]) {
			teletext[teletextRow][teletextCol] = 32;
		}

		let mask = (charCol == 1 && charRow == 2)
			? (1 << 6)
			: 1 << (charCol + (charRow * 2));

		/* If the alpha channel is not zero. */
		if (pngData[i + 3] !== 0x00) {
			teletext[teletextRow][teletextCol] |= mask;
		}
	}

	return teletext;
}
