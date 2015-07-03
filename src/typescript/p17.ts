/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="config.ts" />

declare module THREE {
  export var OrbitControls;
}

class MainApp17 {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: THREE.OrbitControls;

  //particle settings
  private pc: THREE.PointCloud;
  private pcMaterial: THREE.PointCloudMaterial;
  private bg: THREE.BufferGeometry;

  private particleSet = [];
  private particleCount = 45000;
  private spreadMin = 0.01;
  private spreadMax = 0.08;
  private speed = 2; // higher means slower
  private timeToSlow = 0.8;

  constructor() {

    this.scene = new THREE.Scene();
    // this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    // this.camera.position.set(0, 0, 5);
    this.camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
    this.camera.position.z = 2750;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
    this.renderer.shadowMapEnabled = true;
    var container = document.getElementById('container');
    container.appendChild(this.renderer.domElement);

    //add axis
    var axis = new THREE.AxisHelper(1000);
    axis.position.set(0, 0, 0);
    this.scene.add(axis);

    //orbitcontrol
    this.controls = new THREE.OrbitControls(this.camera);

    //resizing
    window.addEventListener("resize", () => { this.onWindowResize(); }, false);

    //particle settings
    this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);
    this.scene.add(new THREE.AmbientLight(0x444444));
    var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(1, 1, 1);
    this.scene.add(light1);
    var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
    light2.position.set(0, -1, 0);
    this.scene.add(light2);

    //bufferGeometry
    this.bg = new THREE.BufferGeometry();
    var positions = new Float32Array(this.particleCount * 3);
    var colors = new Float32Array(this.particleCount * 3);
    var color = new THREE.Color();
    var n = 1000, n2 = n / 2; // particles spread in the cube
    for (var i = 0; i < positions.length; i += 3) {
      // positions
      var x = Math.random() * n - n2;
      var y = Math.random() * n - n2;
      var z = Math.random() * n - n2;
      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;
      // colors
      var vx = (x / n) + 0.5;
      var vy = (y / n) + 0.5;
      var vz = (z / n) + 0.5;
      color.setRGB(vx, vy, vz);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    this.bg.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.bg.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.bg.computeBoundingSphere();

    // this.pcMaterial = new THREE.PointCloudMaterial({
    //   color: 0xFFFFFF,
    //   size: 10,
    //   map: THREE.ImageUtils.loadTexture("images/particles.png"),
    //   transparent: true
    // });
    this.pcMaterial = new THREE.PointCloudMaterial({ size: 15, vertexColors: THREE.VertexColors });
    this.pc = new THREE.PointCloud(this.bg, this.pcMaterial);
    this.scene.add(this.pc);
    console.log(this.bg);
  }

  private onWindowResize() {
    //	this.camera.aspect = window.innerWidth / window.innerHeight;
    //	this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private render() {
    //particle
    /*
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
    */

    this.renderer.render(this.scene, this.camera);
  }

  private update(): void {
    this.updateParticles();
    this.controls.update();
  }

  public animate(): void {
    this.update();
    this.render();

    requestAnimationFrame((e) =>
      this.animate()
      );
  }

  private setGUI(): void {
  }

  private updateParticles(): void {
    // var posArray = this.bg.attributes.position.array;
    // for (var i = 0; i < this.particleCount; i += 3) {
    //   posArray[i + 1] -= Math.random() * this.ySpeed;
    // }
    // this.pc.attributes.needsUpdate = true;
  }

  //Objects
  private container(): THREE.Mesh {
    var geometry = new THREE.PlaneBufferGeometry(1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true });
    var container = new THREE.Mesh(geometry, material);
    return container;
  }

  private parts(): THREE.Mesh {
    var geometry = new THREE.PlaneBufferGeometry(0.01, 0.01);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true });
    var particle = new THREE.Mesh(geometry, material);

    return particle;
  }

  private makeParts(): void {
    var particles = this.parts()
    particles.position.x += 0;
    particles.position.y += 0;
    //particles.velocity = new THREE.Vector3( 0.01, 0.01, 0 );
    this.scene.add(particles);
    this.particleSet.push(particles);
  }

  private rRange(min, max): Number {
    return Math.random() * (max - min) + min;
  }
}

window.addEventListener("load", (e) => {
  console.log("loaded")
  var main: MainApp17 = new MainApp17();
  main.animate()
});
