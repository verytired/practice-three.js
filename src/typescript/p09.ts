/// <reference path="../typings/tsd.d.ts"/>

class MainApp09 {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer;
  private container;
  private controls;
  private geometry2;

  constructor() {

    //1.カメラ追加
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0, 70, 70);

    //2.シーン追加
    this.scene = new THREE.Scene();

    //3.レンダラー追加
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      clearColor: 0x000000,
      clearAlpha: 0,
      alpha: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xffffff);
    this.renderer.shadowMapEnabled = true;

    //4.表示コンテナ指定
    this.container = document.getElementById('container');
    this.container.appendChild(this.renderer.domElement);
    //リサイズ処理
    this.onWindowResize();
    window.addEventListener("resize", (e) => { this.onWindowResize() }, false);

    //5 オブジェクト追加
    //座標軸追加
    var axis = new THREE.AxisHelper(1000);
    axis.position.set(0, 0, 0);
    this.scene.add(axis);

    //光源追加
    var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(0, 100, 30);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    //cube追加
    var geometry = new THREE.CubeGeometry(40, 40, 40);
    var material = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: true });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 60, 0);
    cube.castShadow = true;
    this.scene.add(cube);

    this.geometry2 = new THREE.PlaneGeometry(150, 150, 64, 64);
    material = new THREE.MeshPhongMaterial({ color: 0x3333333, wireframe: false });
    var ground = new THREE.Mesh(this.geometry2, material);
    ground.rotation.x = Math.PI / -2;
    this.scene.add(ground);

    var pn = new SimplexNoise();
    for (var i = 0; i < this.geometry2.vertices.length; i++) {
      var vertex = this.geometry2.vertices[i];
      vertex.z = pn.noise(vertex.x / 20, vertex.y / 20);
    }
    this.geometry2.computeFaceNormals();
    this.geometry2.computeVertexNormals();

    //マウス制御機能追加
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.container.addEventListener("mousemove", (e) => {
      var mouseX, mouseY;
      mouseX = e.clientX - 600 / 2;
      mouseY = e.clientY - 400 / 2;
    }, false);

    /*** ADDING SCREEN SHOT ABILITY ***/
    window.addEventListener("keyup", (e) => {
      var imgData, imgNode;
      //Listen to 'P' key
      if (e.which !== 80) return;
      try {
        imgData = this.renderer.domElement.toDataURL();
        console.log(imgData);
      }
      catch (e) {
        console.log(e)
        console.log("Browser does not support taking screenshot of 3d context");
        return;
      }
    });

  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private update() {
    this.controls.update();
    //        for ( i = 0; i < this.geometry2.vertices.length; i++ ) {
    //            var vertex = this.geometry2.vertices[ i ];
    //            vertex.z = Math.random()*20;
    //        }
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public animate() {
    requestAnimationFrame((e) =>
      this.animate()
      );
    this.render();
  }
}

window.addEventListener("load", (e) => {
  var main: MainApp09 = new MainApp09();
  main.animate();
});
