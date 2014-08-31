main = {}

main = do ->
  init = ->

    #1. make scene
    scene = new THREE.Scene()

    #2. set camera
    camera = new THREE.PerspectiveCamera 75, 600 / 400, 1, 1000
    camera.position.set 0, 70, 70

    #3. rendering
    if window.WebGLRenderingContext
      renderer = new THREE.WebGLRenderer()
    else
      renderer = new THREE.CanvasRenderer()
    renderer.setSize 600, 400
    renderer.setClearColor 0xffffff
    renderer.shadowMapEnabled = true

    container = document.getElementById('container')
    container.appendChild renderer.domElement

    #4. lighting
    directionalLight = new THREE.DirectionalLight("#ffffff", 1)
    directionalLight.position.set 0, 100, 30
    directionalLight.castShadow = true
    scene.add directionalLight

#    ambient = new THREE.AmbientLight 0xffffff
#    scene.add ambient

    #5. mesh
    geometry = new THREE.CubeGeometry(40, 40, 40)
    material = new THREE.MeshPhongMaterial(color: "#ff0000")
    cube = new THREE.Mesh(geometry, material)
    cube.position.set 0, 60, 0
    cube.castShadow = true
    scene.add cube

    geometry2 = new THREE.CubeGeometry(20, 20, 20)
    material2 = new THREE.MeshPhongMaterial(color: "#0000ff")
    cube2 = new THREE.Mesh(geometry2, material2)
    cube2.position.set 0, 50, -50
    cube2.castShadow = true
    scene.add cube2

    pGeometry = new THREE.PlaneGeometry 300, 300
    pMaterial = new THREE.MeshLambertMaterial {color: 0x666666, side: THREE.DoubleSide}
    plane = new THREE.Mesh pGeometry, pMaterial
    plane.position.set 0, 0, 0
    plane.rotation.x = 90 * Math.PI / 180
    plane.receiveShadow = true
    scene.add plane

    #helper
    axis = new THREE.AxisHelper 1000
    axis.position.set 0, 0, 0
    scene.add axis

    #controls
    controls = new THREE.OrbitControls camera, renderer.domElement

    #mouse
    container.addEventListener "mousemove", ((e) ->
      mouseX = (e.clientX - 600 / 2)
      mouseY = (e.clientY - 400 / 2)
      cube.rotation.x = mouseY * 0.005
      cube.rotation.y = mouseX * 0.005

      cube2.rotation.y = mouseY * 0.005
      cube2.rotation.z = mouseX * 0.005

      renderer.render scene, camera
      controls.update()
      return
    ), false

    renderer.render scene, camera

  return {
  init: init
  }

#start
main.init()