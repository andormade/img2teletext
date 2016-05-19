(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.png2teletext = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = png2teletext;
function png2teletext(pngData, width) {
	width = width * 4;
	var teletext = [];
	for (var i = 0; i < pngData.length; i += 4) {
		/* Coordinates of the current pixel on the image. */
		var pngRow = Math.floor(i / width);
		var pngCol = i % width / 4;
		/* Coordinates of the teletext characher. */
		var teletextRow = Math.floor(pngRow / 3);
		var teletextCol = Math.floor(pngCol / 2);
		/* Coordinates of the segment inside the teletext character. */
		var charRow = pngRow % 3;
		var charCol = pngCol % 2;

		/* If it doesn't exist. */
		if (!teletext[teletextRow]) {
			teletext[teletextRow] = [];
		}
		if (!teletext[teletextRow][teletextCol]) {
			teletext[teletextRow][teletextCol] = 32;
		}

		var mask = charCol == 1 && charRow == 2 ? 1 << 6 : 1 << charCol + charRow * 2;

		/* If the alpha channel is not zero. */
		if (pngData[i + 3] !== 0x00) {
			teletext[teletextRow][teletextCol] |= mask;
		}
	}

	return teletext;
}
module.exports = exports['default'];
},{}]},{},[1])(1)
});