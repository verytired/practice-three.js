/**
 * original
 * http://threejs.org/examples/webgl_custom_attributes.html
 */

/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="DefinitelyTyped/dat-gui/dat-gui.d.ts" />
/// <reference path="config.ts" />

declare module THREE {
  export var OrbitControls;
}

class MainApp20 {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: THREE.OrbitControls;
  private stats: Stats;

  private vs;
  private fg;
  private sphere;
  private uniforms;
  private attributes;
  private noise = new Array;

  constructor() {
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 1, 10000);
    this.camera.position.z = 300;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x050505);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(WIDTH, HEIGHT);

    var container = document.getElementById('container');
    container.appendChild(this.renderer.domElement);

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    container.appendChild(this.stats.domElement);

    this.controls = new THREE.OrbitControls(this.camera);

    window.addEventListener('resize', () => { this.onWindowResize() }, false);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private makeMesh(): void {
    //shaderMaterial生成
    this.attributes = {
      displacement: { type: 'f', value: [] }
    };

    this.uniforms = {
      amplitude: { type: "f", value: 1.0 },
      color: { type: "c", value: new THREE.Color(0xff2200) },
      texture: { type: "t", value: THREE.ImageUtils.loadTexture("texture/water.jpg") },
    };
    this.uniforms.texture.value.wrapS = this.uniforms.texture.value.wrapT = THREE.RepeatWrapping;

    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      attributes: this.attributes,
      vertexShader: this.vs,
      fragmentShader: this.fg
    });

    var radius = 50, segments = 128, rings = 64;
    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    geometry.dynamic = true;
    this.sphere = new THREE.Mesh(geometry, shaderMaterial);

    var vertices = this.sphere.geometry.vertices;
    var values = this.attributes.displacement.value;
    for (var v = 0; v < vertices.length; v++) {
      values[v] = 0;
      this.noise[v] = Math.random() * 5;
    }
    this.scene.add(this.sphere);
  }

  public animate() {
    requestAnimationFrame((e) => { this.animate() });

    this.update()
    this.render();
    this.controls.update();
    this.stats.update();
  }

  public update() {
    var time = Date.now() * 0.01;

    //オブジェクト回転
    this.sphere.rotation.y = this.sphere.rotation.z = 0.01 * time;

    //uniforms更新
    this.uniforms.amplitude.value = 2.5 * Math.sin(this.sphere.rotation.y * 0.125);
    this.uniforms.color.value.offsetHSL(0.0005, 0, 0);

    //attribute更新
    for (var i = 0; i < this.attributes.displacement.value.length; i++) {
      this.attributes.displacement.value[i] = Math.sin(0.1 * i + time);
      this.noise[i] += 0.5 * (0.5 - Math.random());
      this.noise[i] = THREE.Math.clamp(this.noise[i], -5, 5);
      this.attributes.displacement.value[i] += this.noise[i];
    }
    this.attributes.displacement.needsUpdate = true;
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public loadShader(vertexPath, fragmentPath) {
    $.ajax({
      url: vertexPath,
      success: (data) => {
        this.vs = data
        if (this.fg != undefined) {
          //シェーダ読込完了してたらmeshを生成シーンに追加して再生開始
          this.makeMesh();
          this.animate();
        }
      }
    });
    $.ajax({
      url: fragmentPath,
      success: (data) => {
        this.fg = data
        if (this.vs != undefined) {
          //シェーダ読込完了してたらmeshを生成シーンに追加して再生開始
          this.makeMesh();
          this.animate();
        }
      }
    });
  }
}

window.addEventListener("load", (e) => {
  var main: MainApp20 = new MainApp20();
  main.loadShader('data/shader/p18/p18.vert', 'data/shader/p18/p18.frag');
});
