#!/usr/bin/env node
'use strict';

const program = require('commander');
const png2teletext = require('..');
const { PNG } = require('pngjs');
const fs = require('fs');

program
	.arguments('<file>')
	.option('-o, --out <out>', 'The output file.')
	.action(function(file) {
		console.log('hello');

		const fileBuffer = fs.readFileSync(file);
		const png = PNG.sync.read(fileBuffer);

		const teletextBuffer = png2teletext(png.data, png.width);

		fs.writeFileSync(program.out, teletextBuffer);
	})
	.parse(process.argv);
