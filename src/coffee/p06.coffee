camera = undefined
scene = undefined
renderer = undefined
composer = undefined
object = undefined
light = undefined
video = undefined
videoImage = undefined
videoImageContext = undefined
videoTexture = undefined
controls = undefined

init = ->
	renderer = new THREE.WebGLRenderer
	renderer.setSize window.innerWidth, window.innerHeight
	document.body.appendChild renderer.domElement

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
	camera.position.z = 600
	scene = new THREE.Scene()

	scene.add camera

	#Use webcam
	video = document.createElement('video');
	video.width = 1080;
	video.height = 720;
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
	videoImage = document.getElementById('videoImage');
	videoImageContext = videoImage.getContext('2d');
	#		// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect(0, 0, videoImage.width, videoImage.height);

	videoTexture = new THREE.Texture(videoImage)
	videoTexture.minFilter = THREE.LinearFilter
	videoTexture.magFilter = THREE.LinearFilter
	videoMaterial = new THREE.MeshBasicMaterial({
		map: videoTexture
	});

	planeGeometry = new THREE.PlaneGeometry(1080, 720, 1, 1)
	plane = new THREE.Mesh(planeGeometry, videoMaterial)
	scene.add(plane)
	plane.z = 0
	plane.scale.x = plane.scale.y = 1.45

	# postprocessing
	composer = new THREE.EffectComposer(renderer)
	composer.addPass new THREE.RenderPass(scene, camera)

	dotMatrixPass = new THREE.ShaderPass THREE.DotMatrixShader
	dotMatrixPass.uniforms["size"].value = 10
	composer.addPass dotMatrixPass

	effect = new THREE.ShaderPass(THREE.RGBShiftShader)
	effect.uniforms["amount"].value = 0.0015
	composer.addPass effect

#	renderToScreen
	toScreen = new THREE.ShaderPass(THREE.CopyShader)
	composer.addPass toScreen
	toScreen.renderToScreen = true;

	window.addEventListener "resize", onWindowResize, false

	#controls
	controls = new THREE.OrbitControls camera, renderer.domElement

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

	render()
	controls.update()

	return

render = ->
	if video.readyState is video.HAVE_ENOUGH_DATA
		videoImageContext.drawImage(video, 0, 0, videoImage.width, videoImage.height)
		if videoTexture
			videoTexture.needsUpdate = true
#	renderer.render scene, camera
	composer.render()

init()
animate()