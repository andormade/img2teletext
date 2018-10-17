# png2teletext

png2teletext is a JavaScript library for converting PNGs to teletext level 1 compatible data. Starting from the upper leftmost, the algorithm goes by 2x3 blocks of pixels, and translates them to teletext mosaic charachters.

![poes]

[poes]: poes.gif

It handles images of any dimensions, they don't have to be within the constraints of a standard teletext page.

## Requirements

- node v8 or older (It probably works with older versions as well, but I haven't tested it on anything older than v8.9.0.)
- npm v5 or older

## Installation

This module is distributed via both npm and yarn.

    $ npm install png2teletext --save

## Example with pngjs

    const png2teletext = require('png2teletext');
    const { PNG } = require('pngjs');
    const fs = require('fs');

    const data = fs.readFileSync('./test/test.png');
	const png = PNG.sync.read(data);
	const teletextData = png2teletext(png.data, png.width);

    console.log(teletextData);

