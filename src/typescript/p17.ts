/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="config.ts" />

class MainApp17 {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: THREE.OrbitControls;

  //particle settings
  private pc: THREE.PointCloud;
  private pcMaterial: THREE.PointCloudMaterial;
  private particles: THREE.Geometry;

  private particleSet = [];
  private particleCount = 45000;
  private spreadMin = 0.01;
  private spreadMax = 0.08;
  private speed = 2; // higher means slower
  private timeToSlow = 0.8;

  constructor() {

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMapEnabled = true;
    var container = document.getElementById('container');
    container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera);
    //resizing
    window.addEventListener("resize", () => { this.onWindowResize(); }, false);

    //particle settings
    var light = new THREE.PointLight(0x0000ff, 5, 100);
    light.position.set(1, 1, 2);
    this.scene.add(light);

    this.particles = new THREE.Geometry();
    this.pcMaterial = new THREE.PointCloudMaterial({
      color: 0xFFFFFF,
      size: 10,
      map: THREE.ImageUtils.loadTexture("images/particles.png"),
      transparent: true
    });
    //set particle  positions
    for (var i = 0; i < this.particleCount; i++) {
      var px = Math.random() * 1000 - 500,
        py = Math.random() * 1000 - 500,
        pz = Math.random() * 1000 - 500,
        particle: any = new THREE.Vector3(px, py, pz);
      particle.velocity = new THREE.Vector3(0, -Math.random(), 0);
      this.particles.vertices.push(particle);
    }


    this.pc = new THREE.PointCloud(this.particles, this.pcMaterial);
    // パーティクルの深さを毎フレームソート
    console.log(this.pc);
    this.pc.sortParticles = true;
    this.scene.add(this.pc);

  }

  private onWindowResize() {
    //	this.camera.aspect = window.innerWidth / window.innerHeight;
    //	this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private render() {
    //particle
    if (this.particleSet.length <= this.particleCount) {
      this.makeParts();
    }

    for (var i = 0; i < this.particleSet.length; i++) {
      var pArray = this.particleSet.indexOf(i);

      this.particleSet[i].material.opacity -= 0.008;

      if (this.particleSet[i].material.opacity <= 0) {

        this.particleSet[i].position.x = 0;
        this.particleSet[i].position.y = 0;
        this.particleSet[i].material.opacity = 1

      }
      this.particleSet[i].position.x += (0.002 + this.rRange(-this.spreadMin, this.spreadMax) / this.speed) * this.timeToSlow;
      this.particleSet[i].position.y += (0.002 + this.rRange(-this.spreadMin, this.spreadMax) / this.speed) * this.timeToSlow;

    }
    //
    this.renderer.render(this.scene, this.camera);
  }

  private update() {
    this.controls.update();
  }

  public animate() {
    this.update();
    this.render();

    requestAnimationFrame((e) =>
      this.animate()
      );

  }
  private setGUI() {

  }

  //Objects
  private container() {
    var geometry = new THREE.PlaneBufferGeometry(1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true });
    var container = new THREE.Mesh(geometry, material);

    return container;
  }

  private parts() {
    var geometry = new THREE.PlaneBufferGeometry(0.01, 0.01);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true });
    var particle = new THREE.Mesh(geometry, material);

    return particle;
  }

  private makeParts() {
    var particles = this.parts()

    particles.position.x += 0;
    particles.position.y += 0;
    //particles.velocity = new THREE.Vector3( 0.01, 0.01, 0 );

    this.scene.add(particles);

    this.particleSet.push(particles);

  }

  private rRange(min, max) {
    return Math.random() * (max - min) + min;
  }
}

window.addEventListener("load", (e) => {
  console.log("loaded")
  var main: MainApp17 = new MainApp17();
  main.animate()
});
