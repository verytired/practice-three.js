var MainApp17 = (function () {
    function MainApp17() {
        var _this = this;
        this.particleCount = 500000;
        this.spreadMin = 0.01;
        this.spreadMax = 0.08;
        this.speed = 2;
        this.timeToSlow = 0.8;
        this.guiParams = {
            axis: false,
            isWireFrame: false,
            particleCount: this.particleCount,
        };
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
        this.camera.position.z = 2750;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMapEnabled = true;
        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        container.appendChild(this.stats.domElement);
        this.controls = new THREE.OrbitControls(this.camera);
        window.addEventListener("resize", function () {
            _this.onWindowResize();
        }, false);
        this.scene.fog = new THREE.Fog(0x050505, 2000, 3500);
        this.scene.add(new THREE.AmbientLight(0x444444));
        var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
        light1.position.set(1, 1, 1);
        this.scene.add(light1);
        var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
        light2.position.set(0, -1, 0);
        this.scene.add(light2);
        this.particles = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(this.particleCount * 3);
        var colors = new Float32Array(this.particleCount * 3);
        var color = new THREE.Color();
        var n = 1000, n2 = n / 2;
        for (var i = 0; i < this.particleCount; i++) {
            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;
            this.particlePositions[i * 3] = x;
            this.particlePositions[i * 3 + 1] = y;
            this.particlePositions[i * 3 + 2] = z;
            var vx = (x / n) + 0.5;
            var vy = (y / n) + 0.5;
            var vz = (z / n) + 0.5;
            color.setRGB(vx, vy, vz);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        this.particles.drawcalls.push({
            start: 0,
            count: this.particleCount,
            index: 0,
        });
        this.particles.addAttribute('position', new THREE.DynamicBufferAttribute(this.particlePositions, 3));
        this.particles.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.particles.computeBoundingSphere();
        this.pcMaterial = new THREE.PointCloudMaterial({ size: 15, vertexColors: THREE.VertexColors });
        this.pc = new THREE.PointCloud(this.particles, this.pcMaterial);
        this.scene.add(this.pc);
        this.initGUI();
    }
    MainApp17.prototype.onWindowResize = function () {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp17.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    MainApp17.prototype.update = function () {
        this.updateParticles();
        this.controls.update();
    };
    MainApp17.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.update();
        this.render();
        this.stats.update();
    };
    MainApp17.prototype.updateParticles = function () {
        for (var i = 0; i < this.particleCount; i++) {
            this.particlePositions[i * 3 + 1] -= this.speed * Math.random();
            if (this.particlePositions[i * 3 + 1] < -500) {
                this.particlePositions[i * 3 + 1] = 500;
            }
            var geometry = this.pc.geometry;
            geometry.attributes.position.needsUpdate = true;
        }
    };
    MainApp17.prototype.container = function () {
        var geometry = new THREE.PlaneBufferGeometry(1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true });
        var container = new THREE.Mesh(geometry, material);
        return container;
    };
    MainApp17.prototype.parts = function () {
        var geometry = new THREE.PlaneBufferGeometry(0.01, 0.01);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true });
        var particle = new THREE.Mesh(geometry, material);
        return particle;
    };
    MainApp17.prototype.rRange = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    MainApp17.prototype.initGUI = function () {
        var _this = this;
        var gui = new dat.GUI();
        gui.add(this.guiParams, "particleCount", 0, this.particleCount).onChange(function (value) {
            _this.particleCount = parseInt(value);
            _this.particles.drawcalls[0].count = _this.particleCount;
        });
    };
    return MainApp17;
})();
window.addEventListener("load", function (e) {
    console.log("loaded");
    var main = new MainApp17();
    main.animate();
});
