//定義ファイル
/// <reference path="three.d.ts" />
/// <reference path="jquery.d.ts" />
var MainApp = (function () {
    function MainApp() {
        console.log("main app constructor");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 600 / 400, 1, 1000);
        this.camera.position.set(0, 70, 70);
        if (WebGLRenderingContext) {
            this.renderer = new THREE.WebGLRenderer();
        }
        else {
            this.renderer = new THREE.CanvasRenderer();
        }
        this.renderer.setSize(600, 400);
        this.renderer.setClearColor(0xffffff);
        this.renderer.shadowMapEnabled = true;
        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 100, 30);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        var geometry = new THREE.CubeGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 60, 0);
        cube.castShadow = true;
        this.scene.add(cube);
        var geometry2 = new THREE.CubeGeometry(20, 20, 20);
        var material2 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        var cube2 = new THREE.Mesh(geometry2, material2);
        cube2.position.set(0, 50, -50);
        cube2.castShadow = true;
        this.scene.add(cube2);
        var pGeometry = new THREE.PlaneGeometry(300, 300);
        var pMaterial = new THREE.MeshLambertMaterial({
            color: 0x666666,
            side: THREE.DoubleSide
        });
        var plane = new THREE.Mesh(pGeometry, pMaterial);
        plane.position.set(0, 0, 0);
        plane.rotation.x = 90 * Math.PI / 180;
        plane.receiveShadow = true;
        this.scene.add(plane);
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        container.addEventListener("mousemove", (function (e) {
            var mouseX, mouseY;
            mouseX = e.clientX - 600 / 2;
            mouseY = e.clientY - 400 / 2;
            cube.rotation.x = mouseY * 0.005;
            cube.rotation.y = mouseX * 0.005;
            cube2.rotation.y = mouseY * 0.005;
            cube2.rotation.z = mouseX * 0.005;
        }), false);
    }
    MainApp.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    MainApp.prototype.update = function () {
        this.controls.update();
    };
    MainApp.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
        this.update();
    };
    return MainApp;
})();
window.addEventListener("load", function (e) {
    console.log("loaded");
    var main = new MainApp();
    main.animate();
});
