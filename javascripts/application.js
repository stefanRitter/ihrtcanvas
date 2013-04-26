/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 */
/*jshint loopfunc: true */

(function(self) { "use strict";

  // ******************************************************************************* globals

  var loading, experimentManager;

  // ******************************************************************************* Utils

  function isTouchDevice() {
    return ("ontouchstart" in window) || navigator.msMaxTouchPoints;
  }

  //AJAX
  function xhrGet(reqUri, callback, type) {

    var caller = xhrGet.caller, xhr = new XMLHttpRequest();

    xhr.open('GET', reqUri, true);
    if (type) { xhr.responseType = type; }

    xhr.onload = function () {
      if (callback) {
        try {
          callback(xhr);
        } catch (error) {
          throw 'xhrGet failed: \n' + reqUri + '\nException: ' + error + '\nCaller: ' + caller + '\nResponse: ' + xhr.responseText;
        }
      }
    };

    xhr.send();
  }

  //async script loading
  window.loadScript = function (src, callback)
  {
    var script, rState;
    rState = false;
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = script.onreadystatechange = function() {
      //console.log( this.readyState );
      if ( !rState && (!this.readyState || this.readyState === 'complete') )
      {
        rState = true;
        callback();
      }
    };
    document.body.appendChild(script);
    return script;
  };

  function createImage(event) {
    window.open(canvas.toDataUrl(), 'screen shot');
  }

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

    var script, canvas = null;

    this.name = name;

    this.kill = function() {

      //fade canvas out
      fadeout(canvas, 1000, function() {
        document.body.removeChild(canvas);
        document.body.removeChild(script);
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

      script = loadScript('javascripts/' + name + '.js', function() {
        //when done loading
        setTimeout(function() {
          var func = self[name];
          func(canvas);
          fadein(canvas);
          loading.style.visibility = 'hidden';
        }, 100);
      });
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

    // set global
    loading = document.getElementById('loading');

    for(i = 0; i < links.length; i += 1) {

      links[i].onclick = function(event) {
        var i;

        event.preventDefault();

        for(i = 0; i < links.length; i += 1) {
          links[i].firstChild.className = ''; //delete active class from img
        }
        event.target.className += 'active';

        experimentManager.loadnewproject(event.currentTarget.name);
      };
    }

    loading.style.visibility = 'visible';

    //activate newest entry with fake event object
    links[0].onclick({preventDefault: function() {}, currentTarget: links[0], target: links[0].firstChild });

    if (!isTouchDevice()) {
      //slide up navigation and activate hover state
      setTimeout(function() {
        navigation.className = navigation.className + " hoverDownUp";
      }, 1000);
    } else {
      //for touch devices make navigation touch-able
      setTimeout(function() {
        navigation.className = 'entries clickUp';
      }, 1000);

      navigation.onclick = function (event) {
        event.preventDefault();

        if (navigation.className === 'entries clickDown') {
          navigation.className = 'entries clickUp';
        } else {
          navigation.className = 'entries clickDown';
        }
      };
    }
  };
}(this));