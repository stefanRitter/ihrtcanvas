/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *  pahtfinder implementation of A* algorithm based on Mario Andres Pagella's book
 *
 */

pathfinder = function (canvas) { "use strict";	

	var i, context, tileMap = [],
		path = {
			start: null,
			stop: null
		},
		tile = {
			width: 8,
			height: 8
		},
		grid = {
			width: document.body.clientWidth / tile.width,
			height: document.body.clientWidth / tile.height
		};

	// ************************************************************* DRAW
	function draw(tileX, tileY) {
		var row, col, rowCount, colCount, tilePositionX, tilePositionY;

		function drawTile(row, col) {
			//checks if tile is in tileMap and draws it accordingly

			//calculate pixel position of tile
			tilePositionX = tile.width * row;
			tilePositionY = tile.height * col;

			if (tileMap[row] !== undefined && tileMap[row][col] !== undefined) {
				if (tileMap[row][col] === 0) {
					context.fillStyle = '#CC0E5A';
				} else {
					context.fillStyle = '#362C30';
				}
				context.fillRect(tilePositionX, tilePositionY, tile.width, tile.height);
			} else {
				//not in tileMap
				context.strokeStyle = '#CCCCCC';
				context.strokeRect(tilePositionX, tilePositionY, tile.width, tile.height);
			}
		}

		if (tileX !== undefined && tileY !== undefined) {
			drawTile(tileX, tileY);
			return; //draw only the requested tile
		}

		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height); //erase draw area
		context.fillStyle = '#000000';

		rowCount = Math.floor(canvas.width / tile.width) + 1;
		colCount = Math.floor(canvas.height / tile.height) + 1;

		rowCount = (rowCount > grid.width) ? grid.width : rowCount;
		colCount = (colCount > grid.height) ? grid.height : colCount;

		for (row = 0; row < rowCount; row += 1) {
			for (col = 0; col < colCount; col += 1) {

				drawTile(row, col);
			}
		}
	} //draw()


	// ************************************************************* WEB WORKER
	function callWorker(path, callback) {

		var worker = new Worker('./javascripts/pathfinder_astar.js');
		//pass information to worker
		worker.postMessage({
			tileMap: tileMap,
			grid: {
				width: grid.width,
				height: grid.height
			},
			start: path.stop,
			stop: path.start
		});
		worker.onmessage = callback;
	}

	//draws one tile for every step on the way
	function delayedColor(newi, newx, newy) {
		var i = newi, x = newx, y = newy;

		setTimeout(function() {
			tileMap[x][y] = 0;
			draw(x,y);
		}, 5 * i);
	}

	//draws explosion when goal tile is reached
	function explode(delay, originX, originY) {
		var i;

		for(i = 1; i < 6; i+=1) {
			delayedColor(delay, originX+i, originY+i);
			delayedColor(delay, originX-i, originY-i);
			delayedColor(delay, originX-i, originY+i);
			delayedColor(delay, originX+i, originY-i);

			if (i > 1) { //leave centre of cross empty
				delayedColor(delay, originX, originY+i);
				delayedColor(delay, originX+i, originY);
				delayedColor(delay, originX, originY-i);
				delayedColor(delay, originX-i, originY);
			}
		}
	}

	function processWorkerResults(event) {

		var i, len = event.data.length;

		if (len > 0) {
			for (i = 0; i < len; i+= 1) {

				if (tileMap[event.data[i].x] === undefined) {
					tileMap[event.data[i].x] = [];
				}

				delayedColor(i, event.data[i].x, event.data[i].y);
			}

			i-=1;
			explode(len, event.data[i].x, event.data[i].y);
		}
	}

	// ************************************************************* CLICK EVENT
	function handleClick(event, optimized) {
		
		//translate mouse coords to pixel coords
		var row = Math.floor((event.clientX - 10) / tile.width),
			column = Math.floor((event.clientY - 10) / tile.height);

		if (tileMap[row] === undefined) {
			tileMap[row] = [];
		}

		tileMap[row][column] = 0;

		if (path.start === null) {
			path.start = { x: row, y: column}; //register first click
		} else {
			path.stop = { x: row, y: column}; //register second click

			callWorker(path, processWorkerResults);

			path.start = null;
			path.stop = null;
		}

    optimized ? draw(row, column) : draw();
	}

	function generateRandomElement() {

		var rndRow = Math.floor(Math.random() * (grid.width + 1)),
			rndColumn = Math.floor(Math.random() * (grid.height + 1));

		if (tileMap[rndRow] === undefined) {
			tileMap[rndRow] = [];
		}

		tileMap[rndRow][rndColumn] = 1;
	}

	function doResize() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;

		grid.width = document.body.clientWidth / tile.width;
		grid.height = document.body.clientHeight / tile.height;

		tileMap = [];

		for (i = 0; i < canvas.width; i += 1) {
			generateRandomElement();
		}

		draw();
	}
	
	context = canvas.getContext('2d');

	window.addEventListener('resize', doResize, false);
	doResize();

  // show user how to play
  function demo() {

    var randX, randY, i;

    //handle two random clicks
    for(i = 0; i < 2; i+=1) {
      setTimeout( function() {
        randX = Math.floor(Math.random() * (canvas.width - canvas.width/4 + 1)) + canvas.width/8;
        randY = Math.floor(Math.random() * (canvas.height - canvas.height/4 + 1)) + canvas.height/8;

        context.fillStyle = '#CC0E5A';
        context.font = 'italic 3em EB Garamond serif';
        context.fillText("click!", randX, randY);

        handleClick({clientX: randX, clientY: randY}, true);
      }, (i === 0 ? 1500 : 3000));
    }
  }
  demo();

  setTimeout( function() {
    canvas.addEventListener('click', handleClick, false);
  }, 3800);

  return null;
};