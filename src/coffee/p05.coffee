class App
	constructor: ->
		@container = document.createElement 'div'
		document.body.appendChild @container

		@scene = new THREE.Scene
		@camera = new THREE.PerspectiveCamera 75, 600 / 400, 1, 1000
		@camera.position.set 0, 70, 70
		@scene.add @camera

		#		if window.WebGLRenderingContext
		#			@renderer = new THREE.WebGLRenderer
		#		else
		@renderer = new THREE.CanvasRenderer()
		#		@renderer.setClearColor 0xffffff
		#		@renderer.shadowMapEnabled = true
		@container.appendChild @renderer.domElement

		geometry = new THREE.CubeGeometry 40, 40, 40
		material = new THREE.MeshPhongMaterial({color: "#ff0000"})
		cube = new THREE.Mesh geometry, material
		cube.position.set 0, 60, 0
		@scene.add cube

		geometry2 = new THREE.CubeGeometry(20, 20, 20)
		material2 = new THREE.MeshPhongMaterial(color: "#0000ff")
		cube2 = new THREE.Mesh(geometry2, material2)
		cube2.position.set 0, 50, -50
		cube2.castShadow = true
		@scene.add cube2

		directionalLight = new THREE.DirectionalLight("#ffffff", 1)
		directionalLight.position.set 0, 100, 30
		directionalLight.castShadow = true
		@scene.add directionalLight

		axis = new THREE.AxisHelper 1000
		axis.position.set 0, 0, 0
		@scene.add axis
		@controls = new THREE.TrackballControls @camera, @renderer.domElement

		@stats = new Stats
		@stats.domElement.style.position = 'absolute'
		@stats.domElement.style.top = '0'
		@container.appendChild @stats.domElement

		width = window.innerWidth
		height = window.innerHeight
		@renderer.setSize width, height
		@camera.aspect = width / height
		@camera.updateProjectionMatrix()

		@animate()
		return

	update: ->
		@stats.update()
		@controls.update()
		return

	render: =>
		@renderer.render @scene, @camera

	animate: =>
		requestAnimationFrame @animate
		@update()
		@render()


		return

$ ->
	if Detector.webgl
		new App()
	else
		Detector.addGetWebGLMessage()