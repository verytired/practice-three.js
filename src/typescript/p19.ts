//sample
//https://github.com/izmhr/curveCard_vShaderTest/blob/master/index.html

/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="DefinitelyTyped/dat-gui/dat-gui.d.ts" />
/// <reference path="config.ts" />

class MainApp19 {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls;
  private stats: Stats;

  private clock;
  private myShaderUniforms;
  constructor() {

    this.scene = new THREE.Scene();

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45;
    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    var NEAR = 0.1;
    var FAR = 20000;
    this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    this.camera.position.set(0, 150, 400);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMapEnabled = true;

    var container = document.getElementById('container');
    container.appendChild(this.renderer.domElement);

    //stats
    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    container.appendChild(this.stats.domElement);

    //orbitcontrol
    this.controls = new THREE.OrbitControls(this.camera);
    console.log(this.controls)
    //resizing
    window.addEventListener("resize", () => { this.onWindowResize(); }, false);

    //contents setteing
    this.clock = new THREE.Clock();
    var card, curveCard;

    //setting ojects
    //lightsettings
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0, 150, 100);
    this.scene.add(light);
    var light2 = new THREE.AmbientLight(0x444444);
    this.scene.add(light2);

    // basic moon
    var sphereGeom = new THREE.SphereGeometry(40, 32, 16);
    var moonTexture = THREE.ImageUtils.loadTexture('images/moon.jpg');
    var moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
    var moon = new THREE.Mesh(sphereGeom.clone(), moonMaterial);
    moon.position.set(-100, 50, -100);
    this.scene.add(moon);

    // shaded moon -- side away from light picks up AmbientLight's color.
    var moonTexture2 = THREE.ImageUtils.loadTexture('images/moon.jpg');
    var moonMaterial2 = new THREE.MeshLambertMaterial({ map: moonTexture2 });
    var moon2 = new THREE.Mesh(sphereGeom.clone(), moonMaterial2);
    moon2.position.set(0, 50, -100);
    this.scene.add(moon2);

    // colored moon
    var moonTexture3 = THREE.ImageUtils.loadTexture('images/moon.jpg');
    var moonMaterial3 = new THREE.MeshLambertMaterial({ map: moonTexture3, color: 0xff8800, ambient: 0x0000ff });
    var moon3 = new THREE.Mesh(sphereGeom.clone(), moonMaterial3);
    moon3.position.set(100, 50, -100);
    this.scene.add(moon3);

    //card
    var cardTexture = THREE.ImageUtils.loadTexture('images/card.png');
    var cardGeometry = new THREE.PlaneGeometry(160, 256, 20, 32);
    var carMaterialShaderSimple = new THREE.ShaderMaterial({
      vertexShader: document.getElementById('vertexShaderSimple').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      uniforms: {
        texture: { type: 't', value: cardTexture }
      }
    });

    carMaterialShaderSimple.side = THREE.DoubleSide;
    carMaterialShaderSimple.transparent = true;
    carMaterialShaderSimple.blending = THREE.NormalBlending;
    card = new THREE.Mesh(cardGeometry, carMaterialShaderSimple);
    card.position.set(0, 0, -5);
    this.scene.add(card);

    //-------- 曲げるアニメーションをするシェーダ --------
    this.myShaderUniforms = {
      curlR: { type: 'f', value: 0.0 },
      rotZ: { type: 'f', value: Math.PI / 6.0 },
      texture: { type: 't', value: cardTexture }
    };
    var curveCardMaterial = new THREE.ShaderMaterial({
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      uniforms: this.myShaderUniforms
    });
    curveCardMaterial.side = THREE.DoubleSide;
    curveCardMaterial.transparent = true;
    curveCardMaterial.blending = THREE.NormalBlending;
    curveCard = new THREE.Mesh(cardGeometry, curveCardMaterial);
    this.scene.add(curveCard);
    this.clock.start();
  }

  private onWindowResize(): void {
    //	this.camera.aspect = window.innerWidth / window.innerHeight;
    //	this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private update(): void {
    var _curlR = 200.0 + 150.0 * Math.sin(this.clock.getElapsedTime() * 2.0);
    this.myShaderUniforms.curlR.value = _curlR;
    this.controls.update();
  }

  public animate(): void {
    requestAnimationFrame((e) =>
      this.animate()
      );
    this.update();
    this.render();
    this.stats.update();
  }
}

window.addEventListener("load", (e) => {
  console.log("loaded")
  var main: MainApp19 = new MainApp19();
  main.animate()
});
