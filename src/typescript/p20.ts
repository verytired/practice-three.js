/**
 * original
 * http://www.clicktorelease.com/blog/vertex-displacement-noise-3d-webgl-glsl-three-js
 */

/// <reference path="../typings/tsd.d.ts"/>

class MainApp20 {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls:THREE.OrbitControls;
  private stats: Stats;

  private vs;
  private fg;
  private sphere;
  private uniforms;
  private attributes;
  private noise = new Array;

  private shaderMaterial: THREE.ShaderMaterial;

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
    this.uniforms = {
      time: { // float initialized to 0
        type: "f",
        value: 0.0
      },
      color: { type: "c", value: new THREE.Color(0xff2200) },
      texture: { type: "t", value: THREE.ImageUtils.loadTexture("texture/water.jpg") },
    };
    this.uniforms.texture.value.wrapS = this.uniforms.texture.value.wrapT = THREE.RepeatWrapping;

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vs,
      fragmentShader: this.fg
    });

    var radius = 50, segments = 128, rings = 64;
    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    geometry.dynamic = true;
    this.sphere = new THREE.Mesh(geometry, this.shaderMaterial);
    this.scene.add(this.sphere);
  }

  public animate() {
    requestAnimationFrame((e) => { this.animate() });

    this.update()
    this.render();
    this.controls.update();
    this.stats.update();
  }

  private start = Date.now();
  public update() {
    this.shaderMaterial.uniforms['time'].value = .00025 * (Date.now() - this.start);
    //オブジェクト回転
    this.sphere.rotation.y = this.sphere.rotation.z = 0.01 * (Date.now() - this.start) / 100;
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
  /*main.loadShader('data/shader/p20/p20_1.vert', 'data/shader/p20/p20_1.frag');*/
  /*main.loadShader('data/shader/p20/p20_2.vert', 'data/shader/p20/p20_2.frag');*/
  main.loadShader('data/shader/p20/p20_3.vert', 'data/shader/p20/p20_2.frag');
});
