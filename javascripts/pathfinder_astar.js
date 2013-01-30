/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *  pahtfinder implementation of A* algorithm based on Mario Andres Pagella's book
 * 
 *  contains: Node, NodeList, and Astar
 * 
 */

(function(self) { "use strict";

    // ******************************************************************************* NODE
    function Node(parentNode, src) {
        this.parentNode = parentNode;
        this.x = src.x;
        this.y = src.y;
        this.F = 0;
        this.G = 0;
        this.H = 0;
    }

    // ******************************************************************************* NODELIST
    function NodeList(sorted, sortParam) {
        this.sort =  sorted || false;
        this.sortParam = sortParam || 'F';
        this.list = [];
        this.coordMatrix = [];
    }

	NodeList.prototype.add = function(element) {
        this.list.push(element);

        if (this.coordMatrix[element.x] === undefined) {
            this.coordMatrix[element.x] = [];
        }

        this.coordMatrix[element.x][element.y] = element;

        if (this.sort) {
            var sortby = this.sortParam; //prevent scope error
            this.list.sort(function(o1, o2) { return o1[sortby] - o2[sortby]; });
        }
    };

    NodeList.prototype.remove = function(pos) {
        this.list.splice(pos, 1);
    };

    NodeList.prototype.get = function(pos) {
        return this.list[pos];
    };

    NodeList.prototype.size = function() {
        return this.list.length;
    };

    NodeList.prototype.isEmpty = function() {
        return (this.list.length == 0);
    };

    NodeList.prototype.getByXY = function(x, y) {
        var obj;

        if (this.coordMatrix[x] === undefined) {
            return null;
        }
        
        obj = this.coordMatrix[x][y];
        
        if (obj === undefined) {
            return null;
        }
        
        return obj;
    };

	// ******************************************************************************* ASTAR
	function astar(tileMap, gridW, gridH, src, dest) {
		var openList = new NodeList(true, 'F'),
            closedList = new NodeList(),
            path = new NodeList(),
            currentNode = null,
            nstart, nstop, row, col, element, tempNode,
            grid = {
                rows: gridW,
                cols: gridH
            };

		function checkDifference(src, dest) {
			return (src.x === dest.x && src.y === dest.y);
		}

		function getDistance(src, dest) {
			return Math.abs(src.x - dest.x) + Math.abs(src.y - dest.y);
		}
		
		openList.add(new Node(null, src));

		while(!openList.isEmpty()) {
            currentNode = openList.get(0);

            if (checkDifference(currentNode, dest)) {
                break; //arrived at end
            }

            closedList.add(currentNode);
            openList.remove(0);

            //look at neighbours of the currentNode
            nstart = {
                x: (((currentNode.x - 1) >= 0 ) ? (currentNode.x - 1) : 0),
                y: (((currentNode.y - 1) >= 0 ) ? (currentNode.y - 1) : 0)
            };

            nstop = {
                x: (((currentNode.x + 1) <= grid.rows ) ? (currentNode.x + 1) : grid.rows),
                y: (((currentNode.y + 1) <= grid.cols ) ? (currentNode.y + 1) : grid.cols)
            };

            for(row = nstart.x; row <= nstop.x; row += 1) {
                for(col = nstart.y; col <= nstop.y; col += 1) {
                    
                    //check for obstructions
                    if (tileMap[row] !== undefined && tileMap[row][col] === 1) {
                        continue;
                    } 

                    element = closedList.getByXY(row, col);
                    if (element !== null) {
                        continue; //element already on list
                    }

                    element = openList.getByXY(row, col);
                    if (element !== null) {
                        continue; // this element is already on list
                    }
                    
                    //not in any list:
                    tempNode = new Node(currentNode, { x: row, y: col});
                    tempNode.G = currentNode.G + 1;
                    tempNode.H = getDistance(currentNode, tempNode);
                    tempNode.F = tempNode.G + tempNode.H; //used to sort the list

                    openList.add(tempNode); //add to test list 
                }
            }
		}

		while (currentNode && currentNode.parentNode !== null) {
			path.add(currentNode);
			currentNode = currentNode.parentNode;
		}

		return path.list;
	}

	// ******************************************************************************* ONMESSAGE
	//catch initialize message to create astar class and return result
	self.onmessage = function (event) {
		var a = astar(event.data.tileMap, event.data.grid.width, 
			event.data.grid.height, event.data.start, event.data.stop);
		self.postMessage(a);
	};
}(this));