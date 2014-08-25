(function() {
  var main;

  main = {};

  main = (function() {
    var init;
    init = function() {
      var camera, cube, cube2, directionalLight, geometry, geometry2, material, material2, render, renderer, scene;
      console.log("initialize");
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 1000);
      camera.position.set(0, 0, 70);
      render = function() {
        requestAnimationFrame(render);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        cube2.rotation.y += 0.01;
        cube2.rotation.z += 0.01;
        renderer.render(scene, camera);
      };
      if (window.WebGLRenderingContext) {
        renderer = new THREE.WebGLRenderer();
      } else {
        renderer = new THREE.CanvasRenderer();
      }
      renderer.setSize(600, 400);
      document.getElementById('container').appendChild(renderer.domElement);
      directionalLight = new THREE.DirectionalLight("#ffffff", 1);
      directionalLight.position.set(0, 7, 10);
      scene.add(directionalLight);
      geometry = new THREE.CubeGeometry(10, 10, 10);
      material = new THREE.MeshPhongMaterial({
        color: "#ff0000"
      });
      geometry2 = new THREE.CubeGeometry(20, 20, 20);
      material2 = new THREE.MeshPhongMaterial({
        color: "#0000ff"
      });
      cube = new THREE.Mesh(geometry, material);
      cube2 = new THREE.Mesh(geometry2, material2);
      cube.position.set(0, 0, 10);
      cube2.position.set(0, 50, -50);
      scene.add(cube);
      scene.add(cube2);
      return render();
    };
    return {
      init: init
    };
  })();

  main.init();

}).call(this);
