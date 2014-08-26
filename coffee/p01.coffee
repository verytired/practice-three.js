main = {}
main = do ->
  init = ->
    console.log "initialize"
    #1. make scene
    scene = new THREE.Scene()

    #2. set camera
    camera = new THREE.PerspectiveCamera 75, 600 / 400, 1, 1000
    camera.position.set 0, 0, 70

    render = ->
      requestAnimationFrame render
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      cube2.rotation.y += 0.01
      cube2.rotation.z += 0.01
      renderer.render scene, camera
      return

    if window.WebGLRenderingContext
      renderer = new THREE.WebGLRenderer()
    else
      renderer = new THREE.CanvasRenderer()
    renderer.setSize 600, 400
    document.getElementById('container').appendChild renderer.domElement

    #3. lighting
    directionalLight = new THREE.DirectionalLight("#ffffff", 1)
    directionalLight.position.set 0, 7, 10
    scene.add directionalLight

    #4. mesh
    geometry = new THREE.CubeGeometry(10, 10, 10)
    material = new THREE.MeshPhongMaterial(color: "#ff0000")
    cube = new THREE.Mesh(geometry, material)
    cube.position.set 0, 0, 10
    scene.add cube

    geometry2 = new THREE.CubeGeometry(20, 20, 20)
    material2 = new THREE.MeshPhongMaterial(color: "#0000ff")
    cube2 = new THREE.Mesh(geometry2, material2)
    cube2.position.set 0, 50, -50
    scene.add cube2

    #5. rendaring
    render()

  return {
  init: init
  }

#start
main.init()