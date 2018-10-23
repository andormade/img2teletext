'use strict';

const { mapImageToTeletext } = require('./teletextUtils');

const generateTeletextData = function(
	imageBuffer,
	numberOfChannels,
	imageWidth
) {
	return mapImageToTeletext(
		imageBuffer,
		numberOfChannels,
		imageWidth,
		function(pixel) {
			return pixel[3] > 0x00;
		}
	);
};

module.exports = function png2teletext(imageBuffer, imageWidth, options = {}) {
	const { raw = true } = options;

	if (raw) {
		return generateTeletextData(imageBuffer, 4, imageWidth);
	}
};
