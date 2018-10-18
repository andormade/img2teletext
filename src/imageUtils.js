const getImageCoordinatesFromBytePosition = function(
	pos,
	numberOfChannels,
	imageWidth
) {
	const byteWidth = imageWidth * numberOfChannels;
	return [(pos % byteWidth) / numberOfChannels, Math.floor(pos / byteWidth)];
};

const getImageHeight = function(imageBuffer, numberOfChannels, imageWidth) {
	return Math.ceil(imageBuffer.length / numberOfChannels / imageWidth);
};

const forEachPixel = function(
	imageBuffer,
	numberOfChannels,
	imageWidth,
	callback
) {
	for (
		let byteCounter = 0;
		byteCounter < imageBuffer.length;
		byteCounter += numberOfChannels
	) {
		const [x, y] = getImageCoordinatesFromBytePosition(
			byteCounter,
			numberOfChannels,
			imageWidth
		);
		const color = imageBuffer.slice(
			byteCounter,
			byteCounter + numberOfChannels
		);
		callback(x, y, color);
	}
};

module.exports = {
	getImageCoordinatesFromBytePosition,
	getImageHeight,
	forEachPixel,
};
