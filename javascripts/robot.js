/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 */

robot = function (canvas) {
  // load THREE
  loadScript('javascripts/three.min.js', function() {
    init();
    fillScene();
    createRobot();
    drawHelpers();
    addToDOM();
    setupGui();
    animate();
  });

  var camera, scene, renderer;
  var cameraControls, effectController;
  var clock = new THREE.Clock();
  var gridX = true;
  var gridY = false;
  var gridZ = false;
  var axes = true;
  var ground = true;
  var segments = 32;

  function createRobot() {
    // MATERIALS
    var headMaterial = new THREE.MeshLambertMaterial( );
    headMaterial.color.r = 104/255;
    headMaterial.color.g = 1/255;
    headMaterial.color.b = 5/255;

    var hatMaterial = new THREE.MeshPhongMaterial( { shininess: 100 } );
    hatMaterial.color.r = 24/255;
    hatMaterial.color.g = 38/255;
    hatMaterial.color.b = 77/255;
    hatMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var bodyMaterial = new THREE.MeshPhongMaterial( { shininess: 100 } );
    bodyMaterial.color.setRGB( 31/255, 86/255, 169/255 );
    bodyMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var glassMaterial = new THREE.MeshPhongMaterial( { color: 0x0, specular: 0xFFFFFF,
      shininess: 100, opacity: 0.3, transparent: true } );

    var legMaterial = new THREE.MeshPhongMaterial( { shininess: 4 } );
    legMaterial.color.setHex( 0xAdA79b );
    legMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var footMaterial = new THREE.MeshPhongMaterial( { color: 0x960f0b, shininess: 30 } );
    footMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var sphere, cylinder, cube;

    var bevelRadius = 1.9;  // TODO: 2.0 causes some geometry bug.

    // MODELS
    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** LEGS
    // **************************************************************************************************************
    var leftLeg = new THREE.Object3D();

    var legGeometry = [];
    legGeometry[0] = new THREE.CubeGeometry( 50, 22, 45, 1, 1 );
    cube = new THREE.Mesh( legGeometry[0], footMaterial );
    cube.position.x = 0;
    cube.position.y = 22/2;
    cube.position.z = 0;
    leftLeg.add(cube);

    legGeometry[1] = new THREE.CubeGeometry( 30, 50, 25, 1, 1 );
    cube = new THREE.Mesh( legGeometry[1], footMaterial );
    cube.position.x = 0;
    cube.position.y = 22 + 50/2;
    cube.position.z = 5;
    leftLeg.add(cube);

    legGeometry[2] = new THREE.CubeGeometry( 20, 8, 15, 1, 1 );
    cube = new THREE.Mesh( legGeometry[2], footMaterial );
    cube.position.x = 0;
    cube.position.y = 22 + 50 + 8/2;
    cube.position.z = 7;
    leftLeg.add(cube);

    legGeometry[3] = new THREE.CylinderGeometry( 18, 18, 25, segments, segments );
    cylinder = new THREE.Mesh( legGeometry[3], footMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = 22 + 50/2;
    cylinder.position.z = 5;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftLeg.add(cylinder);

    legGeometry[4] = new THREE.CylinderGeometry( 9, 9, 30, segments, segments );
    cylinder = new THREE.Mesh( legGeometry[4], footMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = 22 + 50/2;
    cylinder.position.z = 5;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftLeg.add(cylinder);

    var rightLeg = new THREE.Object3D();
    cube = new THREE.Mesh( legGeometry[0], footMaterial );
    cube.position.x = 0;
    cube.position.y = 22/2;
    cube.position.z = 0;
    rightLeg.add(cube);

    cube = new THREE.Mesh( legGeometry[1], footMaterial );
    cube.position.x = 0;
    cube.position.y = 22 + 50/2;
    cube.position.z = 5;
    rightLeg.add(cube);

    cube = new THREE.Mesh( legGeometry[2], footMaterial );
    cube.position.x = 0;
    cube.position.y = 22 + 50 + 8/2;
    cube.position.z = 7;
    rightLeg.add(cube);

    cylinder = new THREE.Mesh( legGeometry[3], footMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = 22 + 50/2;
    cylinder.position.z = 5;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightLeg.add(cylinder);

    cylinder = new THREE.Mesh( legGeometry[4], footMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = 22 + 50/2;
    cylinder.position.z = 5;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightLeg.add(cylinder);

    rightLeg.rotation = new THREE.Vector3( 0, Math.PI, 0 );
    rightLeg.position.z = 80;

    scene.add( leftLeg );
    scene.add( rightLeg );

    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** BODY
    // **************************************************************************************************************
  }

  function fillScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

    // LIGHTS
    var ambientLight = new THREE.AmbientLight( 0x222222 );

    var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light.position.set( 200, 400, 500 );

    var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light2.position.set( -500, 250, -200 );

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

  }

  function init() {
    var canvasWidth = canvas.width;
    var canvasHeight = canvas.height;
    var canvasRatio = canvasWidth / canvasHeight;

    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColorHex( 0xAAAAAA, 1.0 );

    // CAMERA
    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 10000 );
    camera.position.set( -384, 758, -492 );
    // CONTROLS
    cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
    cameraControls.target.set(0,100,0);

  }

  function addToDOM() {
      var container = document.getElementById('container');
      var canvas = container.getElementsByTagName('canvas');
      if (canvas.length>0) {
          container.removeChild(canvas[0]);
      }
      container.appendChild( renderer.domElement );
  }

  function drawHelpers() {
    if (ground) {
      Coordinates.drawGround({size:10000});
    }
    if (gridX) {
      Coordinates.drawGrid({size:10000,scale:0.01});
    }
    if (gridY) {
      Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});
    }
    if (gridZ) {
      Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"});
    }
    if (axes) {
      Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
    }
  }

  function animate() {
    window.requestAnimationFrame(animate);
    render();
  }

  function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY ||
         effectController.newGridZ !== gridZ || effectController.newGround !== ground ||
         effectController.newAxes !== axes)
    {
      gridX = effectController.newGridX;
      gridY = effectController.newGridY;
      gridZ = effectController.newGridZ;
      ground = effectController.newGround;
      axes = effectController.newAxes;
          fillScene();
          createRobot();
      drawHelpers();
    }
    renderer.render(scene, camera);
  }

  function setupGui() {

    effectController = {

      newGridX: gridX,
      newGridY: gridY,
      newGridZ: gridZ,
      newGround: ground,
      newAxes: axes
    };

    var gui = new dat.GUI();
    var h = gui.addFolder("Grid display");
    h.add( effectController, "newGridX").name("Show XZ grid");
    h.add( effectController, "newGridY" ).name("Show YZ grid");
    h.add( effectController, "newGridZ" ).name("Show XY grid");
    h.add( effectController, "newGround" ).name("Show ground");
    h.add( effectController, "newAxes" ).name("Show axes");
  }
};
