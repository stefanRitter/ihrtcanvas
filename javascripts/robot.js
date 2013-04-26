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
  var gridX = false;
  var gridY = false;
  var gridZ = false;
  var axes = false;
  var ground = false;

  // defines cylinder resolution
  var segments = 32;




  function createRobot() {

    // MATERIALS
    var lightGreyMaterial = new THREE.MeshPhongMaterial( { color: 0xa6aaad, shininess: 30 } );
    lightGreyMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var darkGreyMaterial = new THREE.MeshPhongMaterial( { color: 0x818284, shininess: 30 } );
    darkGreyMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var eyeMaterial = new THREE.MeshPhongMaterial( { color: 0xf8931f, shininess: 30 } );
    eyeMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var mouthMaterial = new THREE.MeshPhongMaterial( { color: 0x58595b, shininess: 30 } );
    mouthMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    //var glassMaterial = new THREE.MeshPhongMaterial( { color: 0x0, specular: 0xFFFFFF,
    //  shininess: 100, opacity: 0.3, transparent: true } );

    var footMaterial = lightGreyMaterial;
    var headMaterial = lightGreyMaterial;



    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** LEGS
    // **************************************************************************************************************

    // left
    var leftLeg = new THREE.Object3D();
    var cylinder, cube;
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


    // right
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

    rightLeg.rotation = new THREE.Vector3( 0, Math.PI, 0 ); // rotate 180 deg
    rightLeg.position.z = 32;
    leftLeg.position.z = -32;



    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** BODY
    // **************************************************************************************************************

    var body = new THREE.Object3D();

    var legHeight = 22 + 50 + 8;
    cube = new THREE.Mesh( new THREE.CubeGeometry( 70, 13, 100, 1, 1 ), lightGreyMaterial );
    cube.position.x = 0;
    cube.position.y = legHeight + 13/2;
    cube.position.z = 0;
    body.add(cube);

    cube = new THREE.Mesh( new THREE.CubeGeometry( 50, 7, 90, 1, 1 ), darkGreyMaterial );
    cube.position.x = 0;
    cube.position.y = legHeight + 13 + 7/2;
    cube.position.z = 0;
    body.add(cube);

    cube = new THREE.Mesh( new THREE.CubeGeometry( 80, 125, 110, 1, 1 ), lightGreyMaterial );
    cube.position.x = 0;
    cube.position.y = legHeight + 13 + 7 + 125/2;
    cube.position.z = 0;
    body.add(cube);

    cube = bodyShieldMesh( footMaterial );
    cube.position.x = -80/2 - 5;
    cube.position.y = legHeight + 13 + 7 + 125/2;
    cube.position.z = 0;
    body.add(cube);



    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** HEAD
    // **************************************************************************************************************

    var head = new THREE.Object3D();
    var bodyHeigt = legHeight + 13 + 7 + 125;

    cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 34, 34, 2, segments, segments ), darkGreyMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = bodyHeigt + 2/2;
    cylinder.position.z = 0;
    head.add(cylinder);

    cube = new THREE.Mesh( new THREE.CubeGeometry( 90, 65, 85, 1, 1 ), headMaterial );
    cube.position.x = 0;
    cube.position.y = bodyHeigt + 2 + 65/2;
    cube.position.z = 0;
    head.add(cube);


    // ears
    var rightEar = new THREE.Object3D();
    var leftEar = new THREE.Object3D();

    var headMidHeight = bodyHeigt + 2 + 65/2;
    var earGeom = [];

    // right
    earGeom[0] = new THREE.CylinderGeometry( 15, 15, 5, segments, segments );
    cylinder = new THREE.Mesh( earGeom[0], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = headMidHeight;
    cylinder.position.z = 85/2 + 5/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightEar.add(cylinder);

    earGeom[1] = new THREE.CylinderGeometry( 8, 12, 10, segments, segments );
    cylinder = new THREE.Mesh( earGeom[1], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = headMidHeight;
    cylinder.position.z = 85/2 + 5 + 10/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightEar.add(cylinder);


    // left
    cylinder = new THREE.Mesh( earGeom[0], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = headMidHeight;
    cylinder.position.z = 85/2 + 5/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftEar.add(cylinder);

    earGeom[1] = new THREE.CylinderGeometry( 8, 12, 10, segments, segments );
    cylinder = new THREE.Mesh( earGeom[1], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = headMidHeight;
    cylinder.position.z = 85/2 + 5 + 10/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftEar.add(cylinder);

    leftEar.rotation = new THREE.Vector3( 0, Math.PI, 0 );

    head.add( leftEar );
    head.add( rightEar );


    // eyes
    var rightEye = new THREE.Object3D();
    var leftEye = new THREE.Object3D();

    var eyeHeight = headMidHeight + 8,
        eyeBetweenDist = 35,
        eyeRadius = 10,
        eyeFromHeadDist = -90/2,
        eyeGeom = [];

    // right
    eyeGeom[0] = new THREE.CylinderGeometry( eyeRadius, eyeRadius, 2, segments, segments );
    cylinder = new THREE.Mesh( eyeGeom[0], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = eyeHeight;
    cylinder.position.z = 0;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightEye.add(cylinder);

    eyeGeom[1] = new THREE.CylinderGeometry( eyeRadius-2, eyeRadius-2, 2, segments, segments );
    cylinder = new THREE.Mesh( eyeGeom[1], eyeMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = eyeHeight;
    cylinder.position.z = -2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightEye.add(cylinder);

    rightEye.rotation = new THREE.Vector3( 0, 90*Math.PI/180, 0 );
    rightEye.position.x = eyeFromHeadDist;
    rightEye.position.z = eyeBetweenDist/2;

    // left
    cylinder = new THREE.Mesh( eyeGeom[0], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = eyeHeight;
    cylinder.position.z = 0;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftEye.add(cylinder);

    cylinder = new THREE.Mesh( eyeGeom[1], eyeMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = eyeHeight;
    cylinder.position.z = -2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftEye.add(cylinder);

    leftEye.rotation = new THREE.Vector3( 0, 90*Math.PI/180, 0 );
    leftEye.position.x = eyeFromHeadDist;
    leftEye.position.z = -eyeBetweenDist/2;

    head.add( leftEye );
    head.add( rightEye );


    //mouth
    var mouthMesh = buildMouthMesh( mouthMaterial );
    mouthMesh.rotation = new THREE.Vector3( 0, 90*Math.PI/180, 0);
    var mouth = new THREE.Object3D();
    mouth.add(mouthMesh);
    mouth.position.x = eyeFromHeadDist-1;
    mouth.position.y = eyeHeight - 30;
    mouth.position.z = 0;
    mouth.rotation = new THREE.Vector3( 0, 0, 90*Math.PI/180);
    head.add( mouth );

    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** ARMS
    // **************************************************************************************************************





    var robot = new THREE.Object3D();
    robot.add( leftLeg );
    robot.add( rightLeg );
    robot.add( body );
    robot.add( head );
    scene.add( robot );
  }

  function bodyShieldMesh( material ) {
    shield = new THREE.Mesh( new THREE.CubeGeometry( 10, 115, 100, 1, 1 ), material );
    return shield;
  }

  function buildMouthMesh( material ) {
    var height = 3;
    var offset = 1.8;
    var width = 13;
    var depth = 3;
    var geometry = new THREE.Geometry();

    var v1 = new THREE.Vector3(-width,0,height+offset);
    var v2 = new THREE.Vector3(0,0,height);
    var v3 = new THREE.Vector3(width,0,height+offset);
    var v4 = new THREE.Vector3(width,0,offset);
    var v5 = new THREE.Vector3(0,0,0);
    var v6 = new THREE.Vector3(-width,0,offset);

    var v7 = new THREE.Vector3(-width,depth,height+offset);
    var v8 = new THREE.Vector3(0,depth,height);
    var v9 = new THREE.Vector3(width,depth,height+offset);
    var v10 = new THREE.Vector3(width,depth,offset);
    var v11 = new THREE.Vector3(0,depth,0);
    var v12 = new THREE.Vector3(-width,depth,offset);

    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.vertices.push(v4);
    geometry.vertices.push(v5);
    geometry.vertices.push(v6);
    geometry.vertices.push(v7);
    geometry.vertices.push(v8);
    geometry.vertices.push(v9);
    geometry.vertices.push(v10);
    geometry.vertices.push(v11);
    geometry.vertices.push(v12);

    geometry.faces.push( new THREE.Face4( 0, 1, 4, 5 ) );
    geometry.faces.push( new THREE.Face4( 1, 2, 3, 4 ) );

    geometry.faces.push( new THREE.Face4( 6, 7, 10, 11 ) );
    geometry.faces.push( new THREE.Face4( 7, 8, 9, 10 ) );
    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    return new THREE.Mesh( geometry, material);
  }






  // ****************************************************************************************************************
  // ****************************************************************************************************************
  // **************************************************************************************************************** SETUP
  // ****************************************************************************************************************

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
    var canvasWidth = window.innerWidth; //846;
    var canvasHeight = window.innerHeight; //494;
    var canvasRatio = canvasWidth / canvasHeight;

    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColorHex( 0xffffff, 1.0 ); //0xAAAAAA, 1.0 );

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
