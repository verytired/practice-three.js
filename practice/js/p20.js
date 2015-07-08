var MainApp20 = (function () {
    function MainApp20() {
        var _this = this;
        this.noise = new Array;
        this.start = Date.now();
        var WIDTH = window.innerWidth;
        var HEIGHT = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 1, 10000);
        this.camera.position.z = 300;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x050505);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(WIDTH, HEIGHT);
        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        container.appendChild(this.stats.domElement);
        this.controls = new THREE.OrbitControls(this.camera);
        window.addEventListener('resize', function () {
            _this.onWindowResize();
        }, false);
    }
    MainApp20.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp20.prototype.makeMesh = function () {
        this.attributes = {
            displacement: { type: 'f', value: [] }
        };
        this.uniforms = {
            time: {
                type: "f",
                value: 0.0
            },
            color: { type: "c", value: new THREE.Color(0xff2200) },
            texture: { type: "t", value: THREE.ImageUtils.loadTexture("texture/water.jpg") },
        };
        this.uniforms.texture.value.wrapS = this.uniforms.texture.value.wrapT = THREE.RepeatWrapping;
        this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vs,
            fragmentShader: this.fg
        });
        var radius = 50, segments = 128, rings = 64;
        var geometry = new THREE.SphereGeometry(radius, segments, rings);
        geometry.dynamic = true;
        this.sphere = new THREE.Mesh(geometry, this.shaderMaterial);
        var vertices = this.sphere.geometry.vertices;
        var values = this.attributes.displacement.value;
        for (var v = 0; v < vertices.length; v++) {
            values[v] = 0;
            this.noise[v] = Math.random() * 5;
        }
        this.scene.add(this.sphere);
    };
    MainApp20.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) {
            _this.animate();
        });
        this.update();
        this.render();
        this.controls.update();
        this.stats.update();
    };
    MainApp20.prototype.update = function () {
        this.shaderMaterial.uniforms['time'].value = .00025 * (Date.now() - this.start);
    };
    MainApp20.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    MainApp20.prototype.loadShader = function (vertexPath, fragmentPath) {
        var _this = this;
        $.ajax({
            url: vertexPath,
            success: function (data) {
                _this.vs = data;
                if (_this.fg != undefined) {
                    _this.makeMesh();
                    _this.animate();
                }
            }
        });
        $.ajax({
            url: fragmentPath,
            success: function (data) {
                _this.fg = data;
                if (_this.vs != undefined) {
                    _this.makeMesh();
                    _this.animate();
                }
            }
        });
    };
    return MainApp20;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp20();
    main.loadShader('data/shader/p20/p20_3.vert', 'data/shader/p20/p20_2.frag');
});
