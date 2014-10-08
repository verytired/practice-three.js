(function() {
  var animate, camera, composer, init, light, object, onWindowResize, renderer, scene;

  camera = void 0;

  scene = void 0;

  renderer = void 0;

  composer = void 0;

  object = void 0;

  light = void 0;

  init = function() {
    var effect, plane, planeGeometry, toScreen, video, videoMaterial, videoTexture;
    renderer = new THREE.WebGLRenderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;
    scene = new THREE.Scene();
    video = document.createElement('video');
    video.width = 320;
    video.height = 240;
    video.autoplay = true;
    video.loop = true;
    window.URL = window.URL || window.webkitURL;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({
      video: true
    }, function(stream) {
      return video.src = window.URL.createObjectURL(stream);
    }, function(error) {
      prompt.innerHTML = 'Unable to capture WebCam. Please reload the page.';
      return console.log('Unable to capture WebCam. Please reload the page.');
    });
    videoTexture = new THREE.Texture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture
    });
    planeGeometry = new THREE.PlaneGeometry(1080, 720, 1, 1);
    plane = new THREE.Mesh(planeGeometry, videoMaterial);
    scene.add(plane);
    plane.z = 0;
    plane.scale.x = plane.scale.y = 1.45;
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    effect = new THREE.ShaderPass(THREE.DotScreenShader);
    effect.uniforms["scale"].value = 1;
    composer.addPass(effect);
    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms["amount"].value = 0.0015;
    composer.addPass(effect);
    toScreen = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(toScreen);
    toScreen.renderToScreen = true;
    window.addEventListener("resize", onWindowResize, false);
  };

  onWindowResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = function() {
    requestAnimationFrame(animate);
    composer.render();
  };

  init();

  animate();

}).call(this);
