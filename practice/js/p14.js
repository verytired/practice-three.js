var MainApp14 = (function () {
    function MainApp14() {
        this.WIDTH = 640;
        this.HEIGHT = 480;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.autoClear = false;
        document.body.appendChild(this.renderer.domElement);
        this.camera = new THREE.PerspectiveCamera(60, this.WIDTH / this.HEIGHT, 0.001, 1000);
        this.camera.position.set(0, 0, 10);
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0x303030));
        var light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(1, 1, 1);
        this.scene.add(light);
        var mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 20), new THREE.MeshLambertMaterial({ ambient: 0xFFFFFF }));
        mesh.position.set(0, 0, 0);
        this.scene.add(mesh);
        this.init2d();
        this.controls = new THREE.OrbitControls(this.camera);
    }
    MainApp14.prototype.init2d = function () {
        var _this = this;
        this.camera2d = new THREE.OrthographicCamera(0, this.WIDTH, 0, this.HEIGHT, 0.001, 10000);
        this.scene2d = new THREE.Scene();
        THREE.ImageUtils.loadTexture("images/cat1.jpg", undefined, function (texture) {
            texture.minFilter = THREE.NearestFilter;
            var material = new THREE.SpriteMaterial({ map: texture, color: 0xFFFFFF });
            var w = texture.image.width, h = texture.image.height;
            texture.flipY = false;
            var sprite = new THREE.Sprite(material);
            sprite.position.set(w * 0.5, h * 0.5, -9999);
            sprite.scale.set(w, h, 1);
            sprite.scale.y = h;
            _this.scene2d.add(sprite);
            var sprite2 = new THREE.Sprite(material);
            sprite2.position.set(w, h, -1);
            sprite2.scale.set(w, h, 1);
            _this.scene2d.add(sprite2);
        });
    };
    MainApp14.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp14.prototype.update = function () {
        this.controls.update();
    };
    MainApp14.prototype.render = function () {
        this.renderer.clear();
        this.renderer.render(this.scene2d, this.camera2d);
        this.renderer.render(this.scene, this.camera);
    };
    MainApp14.prototype.animate = function () {
        var _this = this;
        this.update();
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
    };
    return MainApp14;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp14();
    main.animate();
});
