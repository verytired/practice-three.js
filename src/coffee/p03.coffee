container = undefined
stats = undefined
camera = undefined
scene = undefined
renderer = undefined
renderers = []
particle = undefined
particles = []
mouseX = 0
mouseY = 0
windowHalfX = window.innerWidth / 2
windowHalfY = window.innerHeight / 2

init = ->
#  container = document.createElement("div")
#  document.body.appendChild container
  container = document.getElementById "container"
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000)
  camera.position.z = 100
  scene = new THREE.Scene()
  material = new THREE.SpriteMaterial(
    map: new THREE.Texture(generateSprite())
    blending: THREE.AdditiveBlending
  )
  i = 0

  while i < 100
    if i % 10 is 0
      material = new THREE.SpriteMaterial(
        map: new THREE.Texture(generateSprite2())
        blending: THREE.AdditiveBlending
      )
    else
      material = new THREE.SpriteMaterial(
        map: new THREE.Texture(generateSprite())
        blending: THREE.AdditiveBlending
      )
    particle = new THREE.Sprite(material)
    initParticle particle, i * 20
    scene.add particle
    i++
  renderer = new THREE.CanvasRenderer()
  renderer.setClearColor 0x000000
  renderer.setSize window.innerWidth, window.innerHeight
  container.appendChild renderer.domElement
  return

generateSprite = ->
  canvas = document.createElement("canvas")
  canvas.width = 100
  canvas.height = 100
  context = canvas.getContext("2d")
  gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
  gradient.addColorStop 0, "rgba(255,255,255,1)"
  gradient.addColorStop 0.2, "rgba(0,255,255,1)"
  gradient.addColorStop 0.4, "rgba(0,0,64,1)"
  gradient.addColorStop 1, "rgba(0,0,0,1)"
  context.fillStyle = gradient
  context.fillRect 0, 0, canvas.width, canvas.height
  canvas

generateSprite2 = ->
  canvas = document.createElement("canvas")
  canvas.width = 100
  canvas.height = 100
  context = canvas.getContext("2d")
  gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
  gradient.addColorStop 0, "rgba(255,255,255,1)"
  gradient.addColorStop 0.2, "rgba(255,0,255,1)"
  gradient.addColorStop 0.4, "rgba(64,0,0,1)"
  gradient.addColorStop 1, "rgba(0,0,0,1)"
  context.fillStyle = gradient
  context.fillRect 0, 0, canvas.width, canvas.height
  canvas

initParticle = (particle, delay) ->
  particle = (if this instanceof THREE.Sprite then this else particle)
  delay = (if delay isnt `undefined` then delay else 0)
  particleSize = 50
  particle.position.set 0, 0, 0
  particle.scale.x = particle.scale.y = Math.random() * particleSize + 16
  xDirection = 2000
  new TWEEN.Tween(particle).delay(delay).to({}, 1000).onComplete(initParticle).start()
  new TWEEN.Tween(particle.position).delay(delay).to(
    x: Math.random() * xDirection - (xDirection / 2)
    y: Math.random() * xDirection - (xDirection / 2)
    z: 0
  , 15000).start()
  new TWEEN.Tween(particle.scale).delay(delay).to(
    x: 0
    y: 0
  , 1000).start()
  return

animate = ->
  requestAnimationFrame animate
  render()
  return

render = ->
  TWEEN.update()
  camera.position.x += (mouseX - camera.position.x) * 0.05
  camera.position.y += (-mouseY - camera.position.y) * 0.05
  camera.lookAt scene.position
  renderer.render scene, camera
  return

init()
animate()