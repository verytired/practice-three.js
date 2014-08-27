(function() {
  var animate, camera, clock, container, controls, cube, init, keyboard, render, renderer, scene, stats, update;

  container = void 0;

  scene = void 0;

  camera = void 0;

  renderer = void 0;

  controls = void 0;

  stats = void 0;

  keyboard = new THREEx.KeyboardState();

  clock = new THREE.Clock();

  cube = void 0;

  init = function() {
    var ASPECT, FAR, NEAR, SCREEN_HEIGHT, SCREEN_WIDTH, VIEW_ANGLE, ambientLight, axes, cubeGeometry, cubeMaterialArray, cubeMaterials, floor, floorGeometry, floorMaterial, floorTexture, light, skyBox, skyBoxGeometry, skyBoxMaterial, sphere, sphereGeometry, sphereMaterial;
    scene = new THREE.Scene();
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    VIEW_ANGLE = 45;
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    NEAR = 0.1;
    FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 150, 400);
    camera.lookAt(scene.position);
    if (Detector.webgl) {
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
    } else {
      renderer = new THREE.CanvasRenderer();
    }
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById("container");
    container.appendChild(renderer.domElement);
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({
      charCode: "m".charCodeAt(0)
    });
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.bottom = "0px";
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
    light = new THREE.PointLight(0xffffff);
    light.position.set(0, 250, 0);
    scene.add(light);
    ambientLight = new THREE.AmbientLight(0x111111);
    sphereGeometry = new THREE.SphereGeometry(50, 32, 16);
    sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x8888ff
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(100, 50, -50);
    scene.add(sphere);
    cubeMaterialArray = [];
    cubeMaterialArray.push(new THREE.MeshBasicMaterial({
      color: 0xff3333
    }));
    cubeMaterialArray.push(new THREE.MeshBasicMaterial({
      color: 0xff8800
    }));
    cubeMaterialArray.push(new THREE.MeshBasicMaterial({
      color: 0xffff33
    }));
    cubeMaterialArray.push(new THREE.MeshBasicMaterial({
      color: 0x33ff33
    }));
    cubeMaterialArray.push(new THREE.MeshBasicMaterial({
      color: 0x3333ff
    }));
    cubeMaterialArray.push(new THREE.MeshBasicMaterial({
      color: 0x8833ff
    }));
    cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray);
    cubeGeometry = new THREE.CubeGeometry(100, 100, 100, 1, 1, 1);
    cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
    cube.position.set(-100, 50, -50);
    scene.add(cube);
    axes = new THREE.AxisHelper(100);
    scene.add(axes);
    floorTexture = new THREE.ImageUtils.loadTexture("images/checkerboard.jpg");
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      side: THREE.DoubleSide
    });
    floorGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
    skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
    skyBoxMaterial = new THREE.MeshBasicMaterial({
      color: 0x9999ff,
      side: THREE.BackSide
    });
    skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
    scene.add(skyBox);
    scene.fog = new THREE.FogExp2(0x9999ff, 0.00025);
  };

  render = function() {
    renderer.render(scene, camera);
  };

  animate = function() {
    requestAnimationFrame(animate);
    render();
    update();
  };

  update = function() {
    var delta;
    delta = clock.getDelta();
    if (keyboard.pressed("1")) {
      document.getElementById("message").innerHTML = " Have a nice day! - 1";
    }
    if (keyboard.pressed("2")) {
      document.getElementById("message").innerHTML = " Have a nice day! - 2 ";
    }
    controls.update();
    stats.update();
  };

  init();

  animate();

}).call(this);
