(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  App = (function() {
    function App() {
      this.animate = __bind(this.animate, this);
      this.render = __bind(this.render, this);
      var axis, cube, cube2, directionalLight, geometry, geometry2, height, material, material2, width;
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
      this.scene = new THREE.Scene;
      this.camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 1000);
      this.camera.position.set(0, 70, 70);
      this.scene.add(this.camera);
      this.renderer = new THREE.CanvasRenderer();
      this.container.appendChild(this.renderer.domElement);
      geometry = new THREE.CubeGeometry(40, 40, 40);
      material = new THREE.MeshPhongMaterial({
        color: "#ff0000"
      });
      cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 60, 0);
      this.scene.add(cube);
      geometry2 = new THREE.CubeGeometry(20, 20, 20);
      material2 = new THREE.MeshPhongMaterial({
        color: "#0000ff"
      });
      cube2 = new THREE.Mesh(geometry2, material2);
      cube2.position.set(0, 50, -50);
      cube2.castShadow = true;
      this.scene.add(cube2);
      directionalLight = new THREE.DirectionalLight("#ffffff", 1);
      directionalLight.position.set(0, 100, 30);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);
      axis = new THREE.AxisHelper(1000);
      axis.position.set(0, 0, 0);
      this.scene.add(axis);
      this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
      this.stats = new Stats;
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.top = '0';
      this.container.appendChild(this.stats.domElement);
      width = window.innerWidth;
      height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.animate();
      return;
    }

    App.prototype.update = function() {
      this.stats.update();
      this.controls.update();
    };

    App.prototype.render = function() {
      return this.renderer.render(this.scene, this.camera);
    };

    App.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      this.update();
      this.render();
    };

    return App;

  })();

  $(function() {
    if (Detector.webgl) {
      return new App();
    } else {
      return Detector.addGetWebGLMessage();
    }
  });

}).call(this);
