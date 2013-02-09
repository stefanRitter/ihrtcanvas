/*
 * 
 *  this file is for testing application.js
 *
 */

black = function (canvas) { "use strict";

	var context = canvas.getContext('2d');
	context.fillStyle = '#000000';
	context.fillRect(0, 0, canvas.width, canvas.height);
};