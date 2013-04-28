/*
 *
 *  Hi there, have a look at my source files here:
 *  https://github.com/stefanRitter/
 * 
 *
 */

robot = function (canvas) {
  var fadeDone = false;

  // load THREE
  loadScript('javascripts/three.min.js', function() {
      init();
      fillScene();
      createRobot();

      header = document.getElementsByTagName('header');
      header[0].style.background = 'transparent';

      addToDOM();
      animate();
  });

  setTimeout( function() {
    fadeDone = true;
  }, 1000);

  var camera, scene, renderer;
  var cameraControls;
  var clock = null;
  var gridX = false;
  var gridY = false;
  var gridZ = false;
  var axes = false;
  var ground = false;

  // defines cylinder resolution
  var segments = 32;

  // global robot parts
  var head, leftArm, leftLowerArm, leftHand, rightArm, rightLowerArm, rightHand;

  // rotation animation
  var anim = {
    headRot: 0,

    leftArm: -47,
    leftLowerArm: -25,
    leftHand: 70,

    rightArm: 125,
    rightLowerArm: 45,
    rightHand: 22
  };



  function createRobot() {

    // MATERIALS
    var lightGreyMaterial = new THREE.MeshPhongMaterial( { color: 0xa6aaad, shininess: 30 } );
    lightGreyMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var evenLightGreyMaterial = new THREE.MeshPhongMaterial( { color: 0xd1d2d4, shininess: 30 } );
    evenLightGreyMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var darkGreyMaterial = new THREE.MeshPhongMaterial( { color: 0x818284, shininess: 30 } );
    darkGreyMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var orangeMaterial = new THREE.MeshPhongMaterial( { color: 0xf8931f, shininess: 30 } );
    orangeMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var evenDarkerGreyMaterial = new THREE.MeshPhongMaterial( { color: 0x494a4b, shininess: 30 } );
    evenDarkerGreyMaterial.specular.setRGB( 0.5, 0.5, 0.5 );

    var footMaterial = lightGreyMaterial;
    var headMaterial = lightGreyMaterial;
    var bellyMaterial = evenDarkerGreyMaterial;
    var innerBellyMaterial = evenLightGreyMaterial;
    var mouthMaterial = evenDarkerGreyMaterial;
    var eyeMaterial = orangeMaterial;


    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** LEGS
    // **************************************************************************************************************

    // left
    var leftLeg = new THREE.Object3D();
    var cylinder, cube;
    var legGeometry = [];
    legGeometry[0] = new THREE.CubeGeometry( 45, 22, 40, 1, 1 );
    cube = new THREE.Mesh( legGeometry[0], footMaterial );
    cube.position.x = 0;
    cube.position.y = 22/2;
    cube.position.z = 2;
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
    cube.position.z = 2;
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
    var mainBodyHeight = 125;

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

    var bodyCenter = 0;
    cube = new THREE.Mesh( new THREE.CubeGeometry( 80, mainBodyHeight, 110, 1, 1 ), lightGreyMaterial );
    cube.position.x = 0;
    cube.position.y = bodyCenter = legHeight + 13 + 7 + mainBodyHeight/2;
    cube.position.z = 0;
    body.add(cube);

    cube = bodyShieldMesh( lightGreyMaterial, 50, mainBodyHeight-8, 5, 3 );
    cube.position.x = -80/2;
    cube.position.y = bodyCenter - (mainBodyHeight-8)/2;
    cube.position.z = -51;
    cube.rotation = new THREE.Vector3( 0, 0, 90*Math.PI/180);
    body.add(cube);

    cube = bodyShieldMesh( lightGreyMaterial, 50, mainBodyHeight-8, 5, 2, 'mirror');
    cube.position.x = -80/2;
    cube.position.y = bodyCenter - (mainBodyHeight-8)/2;
    cube.position.z = 51;
    cube.rotation = new THREE.Vector3( 0, 0, 90*Math.PI/180);
    body.add(cube);

    // belly
    var belly = new THREE.Object3D();
    var bellyRadius = 23;
    var bellyDepth = 1;

    cylinder = new THREE.Mesh( new THREE.CylinderGeometry( bellyRadius, bellyRadius, bellyDepth, segments, segments ),
                               bellyMaterial );
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    belly.add(cylinder);

    cylinder = new THREE.Mesh( new THREE.CylinderGeometry( bellyRadius-3, bellyRadius-3, bellyDepth, segments, segments ),
                               innerBellyMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = 0;
    cylinder.position.z = -bellyDepth;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    belly.add(cylinder);

    belly.rotation = new THREE.Vector3( 0, 90*Math.PI/180, 0 );
    belly.position.x = -80/2 - 5;
    belly.position.y = bodyCenter + 16;
    belly.position.z = 0;
    body.add( belly );


    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** HEAD
    // **************************************************************************************************************

    head = new THREE.Object3D();
    var headHeight = 63;
    var headWidth = 85;

    var bodyHeight = legHeight + 13 + 7 + 125;

    cylinder = new THREE.Mesh( new THREE.CylinderGeometry( 34, 34, 2, segments, segments ), darkGreyMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = bodyHeight + 2/2;
    cylinder.position.z = 0;
    head.add(cylinder);

    cube = new THREE.Mesh( new THREE.CubeGeometry( 90, headHeight, headWidth, 1, 1 ), headMaterial );
    cube.position.x = 0;
    cube.position.y = bodyHeight + 2 + headHeight/2;
    cube.position.z = 0;
    head.add(cube);

    cube = buildFaceMesh( headMaterial, headHeight, headWidth, 4 );
    cube.position.x = -90/2 - 4;
    cube.position.y = bodyHeight + 2;
    cube.position.z = 0;
    head.add(cube);


    // ears
    var rightEar = new THREE.Object3D();
    var leftEar = new THREE.Object3D();

    var headMidHeight = bodyHeight + 2 + headHeight/2;
    var earGeom = [];

    // right
    earGeom[0] = new THREE.CylinderGeometry( 15, 15, 5, segments, segments );
    cylinder = new THREE.Mesh( earGeom[0], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = headMidHeight;
    cylinder.position.z = headWidth/2 + 5/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightEar.add(cylinder);

    earGeom[1] = new THREE.CylinderGeometry( 8, 12, 10, segments, segments );
    cylinder = new THREE.Mesh( earGeom[1], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = headMidHeight;
    cylinder.position.z = headWidth/2 + 5 + 10/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightEar.add(cylinder);


    // left
    cylinder = new THREE.Mesh( earGeom[0], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = headMidHeight;
    cylinder.position.z = headWidth/2 + 5/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftEar.add(cylinder);

    earGeom[1] = new THREE.CylinderGeometry( 8, 12, 10, segments, segments );
    cylinder = new THREE.Mesh( earGeom[1], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = headMidHeight;
    cylinder.position.z = headWidth/2 + 5 + 10/2;
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
        eyeFromHeadDist = -90/2 - 3,
        eyeDepth = 3,
        eyeGeom = [];

    // right
    eyeGeom[0] = new THREE.CylinderGeometry( eyeRadius, eyeRadius, eyeDepth, segments, segments );
    cylinder = new THREE.Mesh( eyeGeom[0], headMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = eyeHeight;
    cylinder.position.z = 0;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightEye.add(cylinder);

    eyeGeom[1] = new THREE.CylinderGeometry( eyeRadius-2, eyeRadius-2, eyeDepth, segments, segments );
    cylinder = new THREE.Mesh( eyeGeom[1], eyeMaterial );
    cylinder.position.x = 0;
    cylinder.position.y = eyeHeight;
    cylinder.position.z = -eyeDepth;
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
    cylinder.position.z = -eyeDepth;
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
    mouth.position.x = eyeFromHeadDist + 2.5;
    mouth.position.y = eyeHeight - 30;
    mouth.position.z = 0;
    mouth.rotation = new THREE.Vector3( 0, 0, 90*Math.PI/180);
    head.add( mouth );


    // **************************************************************************************************************
    // **************************************************************************************************************
    // ************************************************************************************************************** ARMS
    // **************************************************************************************************************

    var armHeight = bodyHeight - 30;
    var armLen = 60;

    // left
    leftArm = new THREE.Object3D();
    leftArm.position.x = 0;
    leftArm.position.y = armHeight;
    leftArm.position.z = 55;

    armGeom = [];
    armGeom[0] = new THREE.CylinderGeometry( 20, 20, 15, segments, segments);
    cylinder = new THREE.Mesh( armGeom[0], lightGreyMaterial );
    cylinder.position.z = 15/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftArm.add(cylinder);

    armGeom[1] = new THREE.CylinderGeometry( 18, 18, 2, segments, segments);
    cylinder = new THREE.Mesh( armGeom[1], lightGreyMaterial );
    cylinder.position.z = 16;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftArm.add(cylinder);

    armGeom[2] = new THREE.CubeGeometry( armLen, 15, 12, 1, 1 );
    cube = new THREE.Mesh( armGeom[2], lightGreyMaterial );
    cube.position.x = -armLen/2;
    cube.position.z = 15/2;
    leftArm.add(cube);

    armGeom[3] = new THREE.CylinderGeometry( 8, 8, 16, segments, segments);
    cylinder = new THREE.Mesh( armGeom[3], lightGreyMaterial );
    cylinder.position.x = -armLen;
    cylinder.position.z = 15/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftArm.add(cylinder);

    leftLowerArm = new THREE.Object3D();
    armGeom[4] = new THREE.CubeGeometry( armLen, 12, 12, 1, 1 );
    cube = new THREE.Mesh( armGeom[4], lightGreyMaterial );
    cube.position.x = -armLen/2;
    leftLowerArm.position.x = -armLen;
    leftLowerArm.position.z = 15/2;
    leftLowerArm.add(cube);

    leftHand = new THREE.Object3D();
    armGeom[5] =  new THREE.TubeGeometry( 12.5, 12.5, 9, 9, 20, segments, segments, 300*Math.PI/180, 290*Math.PI/180);
    //armGeom[5] = new THREE.CylinderGeometry( 12, 12, 20, segments, segments);
    cylinder = new THREE.Mesh( armGeom[5], lightGreyMaterial );
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    leftHand.position.x = -armLen - 10;
    leftHand.add(cylinder);

    leftLowerArm.add(leftHand);

    leftArm.add(leftLowerArm);


    // right
    rightArm = new THREE.Object3D();
    rightArm.position.x = 0;
    rightArm.position.y = armHeight;
    rightArm.position.z = -55;

    cylinder = new THREE.Mesh( armGeom[0], lightGreyMaterial );
    cylinder.position.z = 15/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightArm.add(cylinder);

    cylinder = new THREE.Mesh( armGeom[1], lightGreyMaterial );
    cylinder.position.z = 16;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightArm.add(cylinder);

    cube = new THREE.Mesh( armGeom[2], lightGreyMaterial );
    cube.position.x = -armLen/2;
    cube.position.z = 15/2;
    rightArm.add(cube);

    cylinder = new THREE.Mesh( armGeom[3], lightGreyMaterial );
    cylinder.position.x = -armLen;
    cylinder.position.z = 15/2;
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightArm.add(cylinder);

    rightLowerArm = new THREE.Object3D();
    cube = new THREE.Mesh( armGeom[4], lightGreyMaterial );
    cube.position.x = -armLen/2;
    rightLowerArm.position.x = -armLen;
    rightLowerArm.position.z = 15/2;
    rightLowerArm.add(cube);

    rightHand = new THREE.Object3D();
    cylinder = new THREE.Mesh( armGeom[5], lightGreyMaterial );
    cylinder.rotation = new THREE.Vector3( 90*Math.PI/180, 0, 0);
    rightHand.position.x = -armLen -10;
    rightHand.add(cylinder);

    rightLowerArm.add(rightHand);

    rightArm.add(rightLowerArm);
    rightArm.rotation = new THREE.Vector3( 0, Math.PI, Math.PI);



    var robot = new THREE.Object3D();
    robot.add( leftLeg );
    robot.add( rightLeg );
    robot.add( body );
    robot.add( head );
    robot.add( leftArm );
    robot.add( rightArm );
    scene.add( robot );
  }


  // ****************************************************************************************************************
  // ****************************************************************************************************************
  // **************************************************************************************************************** SPECIALS
  // ****************************************************************************************************************



  function buildFaceMesh ( material, h, w, d ) {
    var height = h || 40;
    var width = w || 80;
    var depth = d|| 4;

    var geometry = new THREE.Geometry();

    var v0 = new THREE.Vector3( depth, 0, -width/2 );
    var v1 = new THREE.Vector3( depth, 0, width/2 );
    var v2 = new THREE.Vector3( 0, 0, 0 );

    var v3 = new THREE.Vector3( depth, height, -width/2 );
    var v4 = new THREE.Vector3( depth, height, width/2 );
    var v5 = new THREE.Vector3( 0, height, 0 );

    geometry.vertices.push(v0);
    geometry.vertices.push(v1);
    geometry.vertices.push(v2);
    geometry.vertices.push(v3);
    geometry.vertices.push(v4);
    geometry.vertices.push(v5);

    // bottom
    geometry.faces.push( new THREE.Face3( 1, 2, 0 ) );
    // top
    geometry.faces.push( new THREE.Face3( 5, 4, 3 ) );
    // back
    geometry.faces.push( new THREE.Face4( 3, 4, 1, 0 ) );
    //front
    geometry.faces.push( new THREE.Face4( 0, 2, 5, 3 ) );
    geometry.faces.push( new THREE.Face4( 2, 1, 4, 5 ) );

    geometry.computeCentroids();
    geometry.computeFaceNormals();
    return new THREE.Mesh( geometry, material);
  }

  function buildMouthMesh( material, h, o, w, d ) {
    var height = h || 3;
    var offset = o || 1.8;
    var width = w || 13;
    var depth = d || 5;

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

    // back
    geometry.faces.push( new THREE.Face4( 0, 1, 4, 5 ) );
    geometry.faces.push( new THREE.Face4( 1, 2, 3, 4 ) );

    // top
    geometry.faces.push( new THREE.Face4( 0, 1, 7, 6 ) );
    geometry.faces.push( new THREE.Face4( 1, 2, 8, 7 ) );

    // front
    geometry.faces.push( new THREE.Face4( 6, 7, 10, 11 ) );
    geometry.faces.push( new THREE.Face4( 7, 8, 9, 10 ) );

    // bottom
    geometry.faces.push( new THREE.Face4( 11, 10, 4, 5 ) );
    geometry.faces.push( new THREE.Face4( 10, 9, 3, 4 ) );

    // sides
    geometry.faces.push( new THREE.Face4( 2, 3, 9, 8 ) );
    geometry.faces.push( new THREE.Face4( 6, 11, 5, 0 ) );

    geometry.computeCentroids();
    geometry.computeFaceNormals();
    //geometry.computeVertexNormals(); // makes it appear soft
    return new THREE.Mesh( geometry, material);
  }

  function bodyShieldMesh( material, width, height, depth, steep, mirror ) {
    var h = height || 80;
    var w = width || 40;
    var d = depth || 4;
    var s = steep || 2;

    var geometry = new THREE.Geometry();

    geometry.vertices.push( new THREE.Vector3( h, 0, 0 ));
    geometry.vertices.push( new THREE.Vector3( h, 0, w ));
    geometry.vertices.push( new THREE.Vector3( 0, 0, w ));
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ));

    geometry.vertices.push( new THREE.Vector3( 2*h/4, 0, 0 ));
    geometry.vertices.push( new THREE.Vector3( 2*h/4, 0, w/8 ));
    geometry.vertices.push( new THREE.Vector3( 3*h/4, 0, w/8 ));
    geometry.vertices.push( new THREE.Vector3( 3*h/4, 0, 0 ));

    geometry.vertices.push( new THREE.Vector3( h, d, 0 ));
    geometry.vertices.push( new THREE.Vector3( h, d, w ));
    geometry.vertices.push( new THREE.Vector3( 0, d, w ));
    geometry.vertices.push( new THREE.Vector3( 0, d, 0 ));
    geometry.vertices.push( new THREE.Vector3( 2*h/4, d, 0 ));
    geometry.vertices.push( new THREE.Vector3( 2*h/4, d, w/8 + s));
    geometry.vertices.push( new THREE.Vector3( 3*h/4, d, w/8 + s));
    geometry.vertices.push( new THREE.Vector3( 3*h/4, d, 0 ));

    // mirror
    if (mirror) {
      var m = new THREE.Matrix4(
                                  1, 0, 0, 0,
                                  0, 1, 0, 0,
                                  0, 0, -1,0,
                                  0, 0, 0, 1 );
      geometry.applyMatrix( m );

      // bottom
      geometry.faces.push( new THREE.Face4( 7, 6, 1, 0 ) );
      geometry.faces.push( new THREE.Face4( 6, 5, 2, 1 ) );
      geometry.faces.push( new THREE.Face4( 4, 3, 2, 5 ) );
      geometry.faces.push( new THREE.Face4( 4, 5, 6, 7 ) );

      // top
      geometry.faces.push( new THREE.Face4( 8, 9, 14, 15 ) );
      geometry.faces.push( new THREE.Face4( 9, 10, 13, 14 ) );
      geometry.faces.push( new THREE.Face4( 10, 11, 12, 13 ) );

      // sides
      geometry.faces.push( new THREE.Face4( 11, 10, 2, 3 ) );
      geometry.faces.push( new THREE.Face4( 1, 2, 10, 9 ) );
      geometry.faces.push( new THREE.Face4( 0, 1, 9, 8 ) );
      geometry.faces.push( new THREE.Face4( 8, 15, 7, 0 ) );
      geometry.faces.push( new THREE.Face4( 12, 11, 3, 4 ) );

      // cut out
      geometry.faces.push( new THREE.Face3( 15, 14, 7 ) );
      geometry.faces.push( new THREE.Face3( 4, 13, 12 ) );
      geometry.faces.push( new THREE.Face4( 14, 13, 4, 7 ) );

    } else {

      // bottom
      geometry.faces.push( new THREE.Face4( 0, 1, 6, 7 ) );
      geometry.faces.push( new THREE.Face4( 1, 2, 5, 6 ) );
      geometry.faces.push( new THREE.Face4( 5, 2, 3, 4 ) );
      geometry.faces.push( new THREE.Face4( 7, 6, 5, 4 ) );

      // top
      geometry.faces.push( new THREE.Face4( 15, 14, 9, 8 ) );
      geometry.faces.push( new THREE.Face4( 14, 13, 10, 9 ) );
      geometry.faces.push( new THREE.Face4( 13, 12, 11, 10 ) );

      // sides
      geometry.faces.push( new THREE.Face4( 3, 2, 10, 11 ) );
      geometry.faces.push( new THREE.Face4( 9, 10, 2, 1 ) );
      geometry.faces.push( new THREE.Face4( 8, 9, 1, 0 ) );
      geometry.faces.push( new THREE.Face4( 0, 7, 15, 8 ) );
      geometry.faces.push( new THREE.Face4( 4, 3, 11, 12 ) );

      // cut out
      geometry.faces.push( new THREE.Face3( 7, 14, 15 ) );
      geometry.faces.push( new THREE.Face3( 12, 13, 4 ) );
      geometry.faces.push( new THREE.Face4( 7, 4, 13, 14 ) );
    }

    geometry.computeCentroids();
    geometry.computeFaceNormals();
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
    clock = new THREE.Clock();

    var canvasWidth = window.innerWidth; //846;
    var canvasHeight = window.innerHeight; //494;
    var canvasRatio = canvasWidth / canvasHeight;

    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColorHex( 0x272e38, 1.0 ); //0xAAAAAA, 1.0 );

    // CAMERA
    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 10000 );
    camera.position.set( -384, 758, -492 );
    // CONTROLS
    cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
    cameraControls.target.set(0,100,0);

  }

  function addToDOM() {

    document.body.removeChild(canvas);

    var header = document.getElementsByTagName('header');
    renderer.domElement.id ='playfield';
    document.body.insertBefore(renderer.domElement, header[0]);
  }

  function animate() {
    var req = window.requestAnimationFrame(animate);

    head.rotation = new THREE.Vector3( 0, anim.headRot * Math.PI/180, 0);

    leftArm.rotation = new THREE.Vector3( 0, 0, anim.leftArm * Math.PI/180);
    leftLowerArm.rotation = new THREE.Vector3( 0, 0, anim.leftLowerArm * Math.PI/180);
    leftHand.rotation = new THREE.Vector3( anim.leftHand * Math.PI/180, 0, 0 );

    rightArm.rotation = new THREE.Vector3( 0, Math.PI, anim.rightArm * Math.PI/180);
    rightLowerArm.rotation = new THREE.Vector3( 0, 0, anim.rightLowerArm * Math.PI/180);
    rightHand.rotation = new THREE.Vector3( anim.rightHand * Math.PI/180, 0, 0 );

    render();

    if (fadeDone && document.getElementsByTagName('canvas').length > 1) {
      window.cancelAnimationFrame(req);

      fadeout(renderer.domElement, 1000, function() {
        document.body.removeChild(renderer.domElement);
        camera = scene = renderer = cameraControls = null;
      });
    }
  }

  function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    updateAnimation(delta);
    renderer.render(scene, camera);
  }

  function updateAnimation(deltaTime) {
    return;
  }
};
