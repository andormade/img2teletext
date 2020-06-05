import { mapImageToTeletext } from './teletextUtils';
import { avg } from './mathUtils';

const img2teletext = function(imageBuffer, imageWidth, numberOfChannels = 4) {
	return mapImageToTeletext(
		imageBuffer,
		numberOfChannels,
		imageWidth,
		function(pixel) {
			return avg(...pixel) > 0x80;
		}
	);
};

export * from './teletextUtils';
export default img2teletext;