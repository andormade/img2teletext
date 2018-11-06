# img2teletext

This is a CLI application for converting images to teletext level 1 compatible data. Starting from the upper leftmost, the algorithm goes by 2x3 blocks of pixels, and translates them to teletext mosaic charachters. It can also be used as a Node.js library.

![poes]

[poes]: poes.gif

It handles images of any dimensions, they don't have to be within the constraints of a standard teletext page.

## Requirements

- node v8 or older (It probably works with older versions as well, but I haven't tested it on anything older than v8.9.0.)
- npm v5 or older (It comes with node.)

## Installation

This module is distributed via both npm and yarn.

    $ npm install img2teletext --g

## Command line example

    $ img2teletext ./test/test.png --out teletextData.bin

## Using it as a Node.js library

    const img2teletext = require('img2teletext');
    const { PNG } = require('pngjs');
    const fs = require('fs');

    const data = fs.readFileSync('./test/test.png');
	const png = PNG.sync.read(data);
	const teletextData = img2teletext(png.data, png.width);

    console.log(teletextData);

This code is released under the MIT license, feel free to do whatever you want with it.
