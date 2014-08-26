(function() {
  var main;

  main = {};

  main = (function() {
    var init;
    init = function() {
      var camera, container, cube, cube2, directionalLight, geometry, geometry2, material, material2, renderer, scene;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 1000);
      camera.position.set(0, 0, 70);
      if (window.WebGLRenderingContext) {
        renderer = new THREE.WebGLRenderer();
      } else {
        renderer = new THREE.CanvasRenderer();
      }
      renderer.setSize(600, 400);
      container = document.getElementById('container');
      container.appendChild(renderer.domElement);
      directionalLight = new THREE.DirectionalLight("#ffffff", 1);
      directionalLight.position.set(0, 7, 10);
      scene.add(directionalLight);
      geometry = new THREE.CubeGeometry(40, 40, 40);
      material = new THREE.MeshPhongMaterial({
        color: "#ff0000"
      });
      cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, 0);
      scene.add(cube);
      geometry2 = new THREE.CubeGeometry(20, 20, 20);
      material2 = new THREE.MeshPhongMaterial({
        color: "#0000ff"
      });
      cube2 = new THREE.Mesh(geometry2, material2);
      cube2.position.set(0, 50, -50);
      scene.add(cube2);
      container.addEventListener("mousemove", (function(e) {
        var mouseX, mouseY;
        mouseX = e.clientX - 600 / 2;
        mouseY = e.clientY - 400 / 2;
        cube.rotation.x = mouseY * 0.005;
        cube.rotation.y = mouseX * 0.005;
        cube2.rotation.y = mouseY * 0.005;
        cube2.rotation.z = mouseX * 0.005;
        renderer.render(scene, camera);
      }), false);
      return renderer.render(scene, camera);
    };
    return {
      init: init
    };
  })();

  main.init();

}).call(this);
