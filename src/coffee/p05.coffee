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

	#
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)
	camera.position.z = 400
	scene = new THREE.Scene()
	scene.fog = new THREE.Fog(0x000000, 1, 1000)
	object = new THREE.Object3D()
	scene.add object
	geometry = new THREE.SphereGeometry(1, 4, 4)
	material = new THREE.MeshPhongMaterial(
		color: 0xffffff
		shading: THREE.FlatShading
	)
	i = 0

	while i < 100
		mesh = new THREE.Mesh(geometry, material)
		mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()
		mesh.position.multiplyScalar Math.random() * 400
		mesh.rotation.set Math.random() * 2, Math.random() * 2, Math.random() * 2
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50
		object.add mesh
		i++
	scene.add new THREE.AmbientLight(0x222222)
	light = new THREE.DirectionalLight(0xffffff)
	light.position.set 1, 1, 1
	scene.add light

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
	object.rotation.x += 0.005
	object.rotation.y += 0.01
	composer.render()
#	renderer.render scene, camera
	return


init()
animate()