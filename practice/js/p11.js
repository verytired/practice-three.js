var MainApp11 = (function () {
    function MainApp11() {
        var _this = this;
        this.mouse = new THREE.Vector2();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 70, 70);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xffffff);
        this.renderer.shadowMapEnabled = true;
        this.container = document.getElementById('container');
        this.container.appendChild(this.renderer.domElement);
        this.onWindowResize();
        window.addEventListener("resize", function (e) {
            _this.onWindowResize();
        }, false);
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 100, 30);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        var geometry = new THREE.BoxGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 60, 0);
        cube.castShadow = true;
        this.scene.add(cube);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.container.addEventListener("mousemove", (function (e) {
            var mouseX, mouseY;
            mouseX = e.clientX - 600 / 2;
            mouseY = e.clientY - 400 / 2;
        }), false);
        this.raycaster = new THREE.Raycaster();
        document.addEventListener('mousemove', (function (e) {
            _this.onDocumentMouseMove(e);
        }), false);
        document.addEventListener('mousedown', (function (e) {
            _this.onClick(e);
        }), false);
    }
    MainApp11.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp11.prototype.onDocumentMouseMove = function (event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    MainApp11.prototype.onClick = function (event) {
        if (this.INTERSECTED === null)
            return;
        var tw = new TWEEN.Tween(this.INTERSECTED.position).to({
            x: 0,
            y: 0,
            z: 100
        }, 2000).easing(TWEEN.Easing.Elastic.Out);
        tw.start();
        new TWEEN.Tween(this.INTERSECTED.rotation).to({
            x: Math.random() * 2 * Math.PI,
            y: Math.random() * 2 * Math.PI,
            z: Math.random() * 2 * Math.PI
        }, 2000).easing(TWEEN.Easing.Elastic.Out).start();
    };
    MainApp11.prototype.update = function () {
        TWEEN.update();
        this.raycaster.setFromCamera(this.mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            if (this.INTERSECTED != intersects[0].object) {
                if (this.INTERSECTED)
                    this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
                this.INTERSECTED = intersects[0].object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex(0xff0000);
            }
        }
        else {
            if (this.INTERSECTED)
                this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
            this.INTERSECTED = null;
        }
    };
    MainApp11.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    MainApp11.prototype.animate = function () {
        var _this = this;
        this.update();
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
    };
    return MainApp11;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp11();
    main.animate();
});
