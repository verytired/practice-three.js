//定義ファイル
/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="DefinitelyTyped/stats/stats.d.ts" />

class MainApp08 {
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer;
  private container;
  private stats;
  private uniforms;

  constructor() {
    this.container = document.getElementById('container');
    this.camera = new THREE.Camera();
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();
    var geometry = new THREE.PlaneBufferGeometry(2, 2);

    this.uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() }
    };

    var material = new THREE.ShaderMaterial({

      uniforms: this.uniforms,
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent

    });

    var mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.container.appendChild(this.stats.domElement);

    this.onWindowResize()
    window.addEventListener("resize", (e) => { this.onWindowResize() }, false);

  }

  private onWindowResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uniforms.resolution.value.x = this.renderer.domElement.width;
    this.uniforms.resolution.value.y = this.renderer.domElement.height;
  }

  private render() {
    this.uniforms.time.value += 0.05;
    this.renderer.render(this.scene, this.camera);
  }


  public animate() {
    requestAnimationFrame((e) =>
      this.animate()
      );
    this.render();
    this.stats.update();
  }
}

window.addEventListener("load", (e) => {
  var main: MainApp08 = new MainApp08();
  main.animate();
});
