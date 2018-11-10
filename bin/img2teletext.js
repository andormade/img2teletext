#!/usr/bin/env node
'use strict';

const program = require('commander');
const img2teletext = require('..');
const { PNG } = require('pngjs');
const jpeg = require('jpeg-js');
const fs = require('fs');
const { encode } = require('teletexthash');
const { fitToTeletextPage } = require('../src/teletextUtils');
const path = require('path');
const btoa = require('btoa');

const getImageBufferAndWidth = function(file) {
	const fileBuffer = fs.readFileSync(file);

	switch (path.extname(file)) {
		case '.jpeg':
		case '.jpg':
			const jpgData = jpeg.decode(fileBuffer);
			return {
				buffer: jpgData.data,
				width: jpgData.width,
			};
		case '.png':
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
	.option('-b, --bin', 'Generate binary output.')
	.option('-e, --edittf', 'Generate edit.tf url.')
	.option('-z, --zxnet', 'Generate zxnet url.')
	.option('-b, --base64', 'Generate base64.')
	.option('-j, --json', 'Generate JSON output.')
	.option(
		'-h, --hash',
		'Generate edit.tf and zxnet compatible teletext hash.'
	)
	.action(function(file, cmd) {
		const { buffer, width } = getImageBufferAndWidth(file);
		const teletextBuffer = fitToTeletextPage(
			img2teletext(buffer, width),
			width / 2
		);

		const teletextHash = encode(teletextBuffer);

		if (cmd.edittf) {
			process.stdout.write('http://edit.tf/' + teletextHash);
		} else if (cmd.zxnet) {
			process.stdout.write(
				'https://zxnet.co.uk/teletext/editor/' + teletextHash + '\n'
			);
		} else if (cmd.hash) {
			process.stdout.write(teletextHash + '\n');
		} else if (cmd.base64) {
			process.stdout.write(btoa(teletextBuffer) + '\n');
		} else if (cmd.bin) {
			process.stdout.write(teletextBuffer);
		} else if (cmd.json) {
			process.stdout.write(`[${teletextBuffer.toString()}]\n`);
		}
	})
	.parse(process.argv);
