camera = undefined
scene = undefined
renderer = undefined
composer = undefined
object = undefined
light = undefined

init = ->
  renderer = new THREE.WebGLRenderer
  renderer.setSize window.innerWidth, window.innerHeight
  document.body.appendChild renderer.domElement

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 400
  scene = new THREE.Scene()

  #Load Video
#  video = document.createElement('video');
#  video.loop = true;
#  video.src = "res/fits.mp4";
#  video.play();

  #Use webcam
  video = document.createElement('video');
  video.width = 320;
  video.height = 240;
  video.autoplay = true;
  video.loop = true;

  #Webcam video
  window.URL = window.URL or window.webkitURL
  navigator.getUserMedia = navigator.getUserMedia or navigator.webkitGetUserMedia or navigator.mozGetUserMedia or navigator.msGetUserMedia

  #get webcam
  navigator.getUserMedia {
    video: true
  }, (stream) ->
    #on webcam enabled
    video.src = window.URL.createObjectURL(stream)
  , (error) ->
    prompt.innerHTML = 'Unable to capture WebCam. Please reload the page.'
    console.log 'Unable to capture WebCam. Please reload the page.'

  #init video texture
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

  # postprocessing
  composer = new THREE.EffectComposer(renderer)
  composer.addPass new THREE.RenderPass(scene, camera)

  effect = new THREE.ShaderPass(THREE.DotScreenShader)
  effect.uniforms["scale"].value = 1
  composer.addPass effect

  effect = new THREE.ShaderPass(THREE.RGBShiftShader)
  effect.uniforms["amount"].value = 0.0015
  composer.addPass effect

  #renderToScreen
  toScreen = new THREE.ShaderPass(THREE.CopyShader)
  composer.addPass toScreen
  toScreen.renderToScreen = true;

  window.addEventListener "resize", onWindowResize, false

  return

onWindowResize = ->
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize window.innerWidth, window.innerHeight
  return

animate = ->
  requestAnimationFrame animate
#  object.rotation.x += 0.005
#  object.rotation.y += 0.01
  composer.render()
  #	renderer.render scene, camera
  return

init()
animate()