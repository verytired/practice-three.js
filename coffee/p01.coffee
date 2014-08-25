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
      cube.rotation.x += 0.01 # 追加
      cube.rotation.y += 0.01 # 追加
      renderer.render scene, camera
      return

    if window.WebGLRenderingContext
      renderer = new THREE.WebGLRenderer()
    else
      renderer = new THREE.CanvasRenderer()
    renderer.setSize 600, 400
    document.getElementById('container').appendChild renderer.domElement
    directionalLight = new THREE.DirectionalLight("#ffffff", 1)
    directionalLight.position.set 0, 7, 10
    scene.add directionalLight
    geometry = new THREE.CubeGeometry(10, 10, 10)
    material = new THREE.MeshPhongMaterial(color: "#dd3b6f")
    cube = new THREE.Mesh(geometry, material)
    cube.position.set 0, 0, 0
    scene.add cube
    console.log "test"
    render()

  return {
  init: init
  }

#start
main.init()