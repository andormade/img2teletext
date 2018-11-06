'use strict';

const { mapImageToTeletext } = require('./teletextUtils');
const { avg } = require('./mathUtils');

module.exports = function img2teletext(imageBuffer, imageWidth, numberOfChannels = 4) {
	return mapImageToTeletext(
		imageBuffer,
		numberOfChannels,
		imageWidth,
		function(pixel) {
			return avg(...pixel) > 0x80;
		}
	);
};
