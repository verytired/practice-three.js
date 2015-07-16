/// <reference path="DefinitelyTyped/eventemitter2/eventemitter2.d.ts" />
/// <reference path="DefinitelyTyped/threejs/three.d.ts" />

class BasicView extends EventEmitter2 {

  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  private stats: Stats;
  private axis: THREE.AxisHelper;

  constructor() {
    super();
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

    this.axis = new THREE.AxisHelper(1000);
    this.axis.position.set(0, 0, 0);
    this.axis.visible = false;
    this.scene.add(this.axis);

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
  }

  public animate() {
    requestAnimationFrame((e) => { this.animate() });
    this.update()
    this.render();
    if (this.stats) this.stats.update();
  }

  public update() {
    this.emit("update");
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public setAxis(flag) {
    this.axis.visible = flag
  }
}

class MainApp21 {

  private view: BasicView

  constructor() {
    this.view = new BasicView();
    this.view.addListener('update', (e) => {
      this.update()
    })
    this.view.setAxis(true);
    this.view.animate();
  }

  public update() {
    /*console.log("view Update main");*/
  }
}

window.addEventListener("load", (e) => {
  var main: MainApp21 = new MainApp21();
});
