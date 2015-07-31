/// <reference path="../typings/tsd.d.ts"/>

class MainApp16 {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer;
  private controls;
  private composer;

  constructor() {
    console.log("main app constructor");
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0, 70, 70);

    if (WebGLRenderingContext) {//window参照しなくていい
      this.renderer = new THREE.WebGLRenderer();
    } else {
      //this.renderer = new THREE.CanvasRenderer();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMapEnabled = true;

    var container = document.getElementById('container');
    container.appendChild(this.renderer.domElement);

    var axis = new THREE.AxisHelper(1000);
    axis.position.set(0, 0, 0);
    this.scene.add(axis);

    window.addEventListener("resize", (e) => { this.onWindowResize() }, false);

    this.controls = new THREE.OrbitControls(this.camera);
    //shape test
    var curve = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(-10, 0),
      new THREE.Vector2(20, 15),
      new THREE.Vector2(10, 0)
      );
    var path = new THREE.Path(curve.getPoints(50));
    var geometry = path.createPointsGeometry(50);
    var material = new THREE.LineBasicMaterial({ color: 0xffffff });
    var curveObject = new THREE.Line(geometry, material);
    this.scene.add(curveObject);

    //shape circle
    var loopShape = new THREE.Shape();
    var r = 50

    loopShape.absarc(0, 0, r, 0, Math.PI * 2, false);//これで円を書いている absarc(原点x,原点y,半径,start角度,end角度,???)
    var loopGeom = loopShape.createPointsGeometry(512 / 2);//shapeにgeometoryの頂点データを生成する  //2点生成されるから半分の数の指定でいい？
    loopGeom.dynamic = true;

    //頂点をLineで結ぶ
    var m = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    var line = new THREE.Line(loopGeom, m);

    var scale = 1;
    scale *= 0.5;
    line.scale.x = scale;
    line.scale.y = scale;
    this.scene.add(line);

    //z-index
    for (var j = 0; j < 512; j++) {
      loopGeom.vertices[j].z = Math.random() * 10
    }
    // link up last segment
    loopGeom.vertices[512].z = loopGeom.vertices[0].z;
  }

  private onWindowResize() {
    //	this.camera.aspect = window.innerWidth / window.innerHeight;
    //	this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private update() {
    this.controls.update();
  }

  public animate() {
    requestAnimationFrame((e) =>
      this.animate()
      );
    this.render();

    this.update();
  }

}

window.addEventListener("load", (e) => {
  var main: MainApp16 = new MainApp16();
  main.animate()
});
