/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 */

(function(self) { "use strict";

	// ******************************************************************************* globals

	var loading, experimentManager;

	// ******************************************************************************* fadein fadeout

	function fadein(element, ms, callback) {

		var time = ms || 1000,
			interv = setInterval(function() {
			element.style.opacity = parseFloat(element.style.opacity) + 0.05;
		}, time/20);

		setTimeout(function () {
			clearInterval(interv);
			element.style.opacity = 1;

			if(callback) {
				callback();
			}
		}, time);
	}

	function fadeout(element, ms, callback) {

		var time = ms || 1000,
			interv = setInterval(function() {
			element.style.opacity = parseFloat(element.style.opacity) - 0.05;
		}, time/20);

		setTimeout(function () {
			clearInterval(interv);
			element.style.opacity = 0;

			if(callback) {
				callback();
			}
		}, time);
	}

	// ******************************************************************************* Experiment

	function Experiment(name) {

		var canvas = null;

		this.name = name;
		this.kill = function() {

			//fade canvas out
			fadeout(canvas, 1000, function() {
				document.body.removeChild(canvas);
			});

			//display loading
			loading.style.visibility = 'visible';
		};

		function createCanvas () {
			var header = document.getElementsByTagName('header');

			canvas = document.createElement("canvas");
			canvas.id = "playfield";
			document.body.insertBefore(canvas, header[0]);

			canvas.style.opacity = 0;	
			canvas.width = document.body.clientWidth;
			canvas.height = document.body.clientHeight;
		}

		function load() {

			createCanvas();

			var func = self[name];
			func(canvas);

			//when done loading
			loading.style.visibility = 'hidden';

			//fade canvas in
			fadein(canvas);		
		}

		load();
	}

	// ******************************************************************************* experimentManager

	experimentManager = {

		currentExperiment: null,

		loadnewproject: function(name) {

			if (this.currentExperiment !== null) {
				this.currentExperiment.kill();
			}

			this.currentExperiment = new Experiment(name);
		}
	};

	// ******************************************************************************* window.onload
	window.onload = function () {

		var i,
			navigations = document.getElementsByClassName("entries"), navigation = navigations[0], 
			links = document.anchors;

		// set globals
		loading = document.getElementById('loading');

		for(i = 0; i < links.length; i += 1) {

			links[i].onclick = function(event) {
				var i;

				event.preventDefault();

				for(i = 0; i < links.length; i += 1) {
					links[i].firstChild.className = ''; //delete active class from img
				}
				event.target.className += ' active';

				experimentManager.loadnewproject(event.currentTarget.name);
			};
		}

		loading.style.visibility = 'visible';

		links[0].onclick({preventDefault: function() {}, currentTarget: links[0], target: links[0].firstChild }); //activate newest entry

		setTimeout(function() {
			navigation.className = navigation.className + " hoverDownUp";
		}, 500);
	};
}(this));