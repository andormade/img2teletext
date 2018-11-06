#!/usr/bin/env node
'use strict';

const program = require('commander');
const img2teletext = require('..');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');
const fs = require('fs');
const { encode } = require('teletexthash');
const { cropToTeletextPage } = require('../src/teletextUtils');
const path = require('path');

const getImageBufferAndWidth = function(file) {
	const fileBuffer = fs.readFileSync(file);

	switch (path.extname(file)) {
		case 'jpeg':
		case 'jpg':
			const jpgData = jpeg.decode(fileBuffer);
			return {
				buffer: jpgData.data,
				width: jpgData.width,
			};
		case 'png':
			const pngData = PNG.sync.read(fileBuffer);
			return {
				buffer: pngData.data,
				width: pngData.width,
			};
		default:
			return {
				buffer: new Uint8Array(0),
				width: 0,
			};
	}
};

program
	.arguments('<file>')
	.option('-o, --out <out>', 'The output file.')
	.option('--edittf', 'Generate edit.tf url.')
	.option('--zxnet', 'Generate zxnet url.')
	.action(function(file, cmd) {
		const { buffer, width } = getImageBufferAndWidth(file);
		const teletextBuffer = img2teletext(buffer, width);
		const teletextHash = encode(cropToTeletextPage(teletextBuffer));
		if (cmd.edittf) {
			console.log('http://edit.tf/' + teletextHash);
		} else if (cmd.zxnet) {
			console.log('https://zxnet.co.uk/teletext/editor/' + teletextHash);
		} else {
			fs.writeFileSync(program.out, teletextBuffer);
		}
	})
	.parse(process.argv);
