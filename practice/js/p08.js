var MainApp08 = (function () {
    function MainApp08() {
        var _this = this;
        this.container = document.getElementById('container');
        this.camera = new THREE.Camera();
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        var geometry = new THREE.PlaneBufferGeometry(2, 2);
        this.uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() }
        };
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent
        });
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.container.appendChild(this.stats.domElement);
        this.onWindowResize();
        window.addEventListener("resize", function (e) {
            _this.onWindowResize();
        }, false);
    }
    MainApp08.prototype.onWindowResize = function () {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.uniforms.resolution.value.x = this.renderer.domElement.width;
        this.uniforms.resolution.value.y = this.renderer.domElement.height;
    };
    MainApp08.prototype.render = function () {
        this.uniforms.time.value += 0.05;
        this.renderer.render(this.scene, this.camera);
    };
    MainApp08.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
        this.stats.update();
    };
    return MainApp08;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp08();
    main.animate();
});
