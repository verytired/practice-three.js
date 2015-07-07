var MainApp18 = (function () {
    function MainApp18() {
        var _this = this;
        this.noise = new Array;
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
        this.control = new THREE.OrbitControls(this.camera);
        window.addEventListener('resize', function () {
            _this.onWindowResize();
        }, false);
    }
    MainApp18.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp18.prototype.makeMesh = function () {
        this.attributes = {
            displacement: { type: 'f', value: [] }
        };
        this.uniforms = {
            amplitude: { type: "f", value: 1.0 },
            color: { type: "c", value: new THREE.Color(0xff2200) },
            texture: { type: "t", value: THREE.ImageUtils.loadTexture("texture/water.jpg") },
        };
        this.uniforms.texture.value.wrapS = this.uniforms.texture.value.wrapT = THREE.RepeatWrapping;
        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            attributes: this.attributes,
            vertexShader: this.vs,
            fragmentShader: this.fg
        });
        var radius = 50, segments = 128, rings = 64;
        var geometry = new THREE.SphereGeometry(radius, segments, rings);
        geometry.dynamic = true;
        this.sphere = new THREE.Mesh(geometry, shaderMaterial);
        var vertices = this.sphere.geometry.vertices;
        var values = this.attributes.displacement.value;
        for (var v = 0; v < vertices.length; v++) {
            values[v] = 0;
            this.noise[v] = Math.random() * 5;
        }
        this.scene.add(this.sphere);
    };
    MainApp18.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) {
            _this.animate();
        });
        this.render();
        this.control.update();
        this.stats.update();
    };
    MainApp18.prototype.render = function () {
        var time = Date.now() * 0.01;
        this.sphere.rotation.y = this.sphere.rotation.z = 0.01 * time;
        this.uniforms.amplitude.value = 2.5 * Math.sin(this.sphere.rotation.y * 0.125);
        this.uniforms.color.value.offsetHSL(0.0005, 0, 0);
        for (var i = 0; i < this.attributes.displacement.value.length; i++) {
            this.attributes.displacement.value[i] = Math.sin(0.1 * i + time);
            this.noise[i] += 0.5 * (0.5 - Math.random());
            this.noise[i] = THREE.Math.clamp(this.noise[i], -5, 5);
            this.attributes.displacement.value[i] += this.noise[i];
        }
        this.attributes.displacement.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    };
    MainApp18.prototype.loadShader = function (vertexPath, fragmentPath) {
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
    return MainApp18;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp18();
    main.loadShader('data/shader/p18/p18.vert', 'data/shader/p18/p18.frag');
});
