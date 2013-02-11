/*
 * 
 *  this file is for testing application.js
 *
 */

black = function (canvas) { "use strict";

	var context = canvas.getContext('2d');
	context.fillStyle = '#000000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = '#FFFFFF';
	context.font = 'italic 40px EB Garamond serif';
	context.fillText("coming soon...", canvas.width/2-120, canvas.height/2);
};