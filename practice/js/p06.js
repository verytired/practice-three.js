(function() {
  var animate, camera, composer, controls, init, light, object, onWindowResize, render, renderer, scene, video, videoImage, videoImageContext, videoTexture;

  camera = void 0;

  scene = void 0;

  renderer = void 0;

  composer = void 0;

  object = void 0;

  light = void 0;

  video = void 0;

  videoImage = void 0;

  videoImageContext = void 0;

  videoTexture = void 0;

  controls = void 0;

  init = function() {
    var dotMatrixPass, effect, plane, planeGeometry, toScreen, videoMaterial;
    renderer = new THREE.WebGLRenderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 600;
    scene = new THREE.Scene();
    scene.add(camera);
    video = document.createElement('video');
    video.width = 1080;
    video.height = 720;
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
    videoImage = document.getElementById('videoImage');
    videoImageContext = videoImage.getContext('2d');
    videoImageContext.fillStyle = '#000000';
    videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);
    videoTexture = new THREE.Texture(videoImage);
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
    dotMatrixPass = new THREE.ShaderPass(THREE.DotMatrixShader);
    dotMatrixPass.uniforms["size"].value = 10;
    composer.addPass(dotMatrixPass);
    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms["amount"].value = 0.0015;
    composer.addPass(effect);
    toScreen = new THREE.ShaderPass(THREE.CopyShader);
    composer.addPass(toScreen);
    toScreen.renderToScreen = true;
    window.addEventListener("resize", onWindowResize, false);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  };

  onWindowResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = function() {
    requestAnimationFrame(animate);
    render();
    controls.update();
  };

  render = function() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      videoImageContext.drawImage(video, 0, 0, videoImage.width, videoImage.height);
      if (videoTexture) {
        videoTexture.needsUpdate = true;
      }
    }
    return composer.render();
  };

  init();

  animate();

}).call(this);
