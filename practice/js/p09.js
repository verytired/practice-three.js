var MainApp09 = (function () {
    function MainApp09() {
        var _this = this;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 70, 70);
        this.scene = new THREE.Scene();
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
        this.container = document.getElementById('container');
        this.container.appendChild(this.renderer.domElement);
        this.onWindowResize();
        window.addEventListener("resize", function (e) {
            _this.onWindowResize();
        }, false);
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 100, 30);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
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
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.container.addEventListener("mousemove", function (e) {
            var mouseX, mouseY;
            mouseX = e.clientX - 600 / 2;
            mouseY = e.clientY - 400 / 2;
        }, false);
        window.addEventListener("keyup", function (e) {
            var imgData, imgNode;
            if (e.which !== 80)
                return;
            try {
                imgData = _this.renderer.domElement.toDataURL();
                console.log(imgData);
            }
            catch (e) {
                console.log(e);
                console.log("Browser does not support taking screenshot of 3d context");
                return;
            }
        });
    }
    MainApp09.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp09.prototype.update = function () {
        this.controls.update();
    };
    MainApp09.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    MainApp09.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
    };
    return MainApp09;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp09();
    main.animate();
});
