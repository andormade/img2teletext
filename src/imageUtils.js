'use strict';

const getImageCoordinatesFromBytePosition = function(
	pos,
	numberOfChannels,
	imageWidth
) {
	const byteWidth = imageWidth * numberOfChannels;
	const x = (pos % byteWidth) / numberOfChannels;
	const y = Math.floor(pos / byteWidth);
	return [x, y];
};

const getImageHeight = function(imageBuffer, numberOfChannels, imageWidth) {
	const numberOfPixels = imageBuffer.length / numberOfChannels;
	return Math.ceil(numberOfPixels / imageWidth);
};

const getPixelDataFromBytePosition = function(
	imageBuffer,
	byteCounter,
	numberOfChannels
) {
	return imageBuffer.slice(byteCounter, byteCounter + numberOfChannels);
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
		const pixel = getPixelDataFromBytePosition(
			imageBuffer,
			byteCounter,
			numberOfChannels
		);
		callback(x, y, pixel);
	}
};

module.exports = {
	getImageCoordinatesFromBytePosition,
	getImageHeight,
	getPixelDataFromBytePosition,
	forEachPixel,
};
