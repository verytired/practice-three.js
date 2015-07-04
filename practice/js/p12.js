var MainApp12 = (function () {
    function MainApp12() {
        var _this = this;
        this.mouse = new THREE.Vector2();
        this.particleCount = 5000;
        this.xSpeed = 0.001;
        this.ySpeed = 0.001;
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.set(0, 0, 500);
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0xEEEEEE, 0.001);
        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x666666);
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
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        this.particleCount = 5000;
        this.particles = new THREE.Geometry();
        var materialParticle = new THREE.PointCloudMaterial({
            color: 0xFFFFFF,
            size: 5,
            map: THREE.ImageUtils.loadTexture("images/particles.png"),
            transparent: true
        });
        for (var i = 0; i < this.particleCount; i++) {
            var px = Math.random() * 1000 - 500, py = Math.random() * 1000 - 500, pz = Math.random() * 1000 - 500, particle = new THREE.Vector3(px, py, pz);
            particle.velocity = new THREE.Vector3(0, -Math.random(), 0);
            this.particles.vertices.push(particle);
        }
        this.pointCloud = new THREE.PointCloud(this.particles, materialParticle);
        this.pointCloud.sortParticles = true;
        this.scene.add(this.pointCloud);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.container.addEventListener("mousemove", (function (e) {
            var mouseX, mouseY;
            mouseX = e.clientX - 600 / 2;
            mouseY = e.clientY - 400 / 2;
        }), false);
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load('data/negimiku/negimiku.dae', function (collada) {
            var test1 = collada.scene;
            test1.scale.set(2, 2, 2);
            _this.scene.add(test1);
        });
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
    MainApp12.prototype.onWindowResize = function () {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp12.prototype.onDocumentMouseMove = function (event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    MainApp12.prototype.update = function () {
        this.updateParticles();
        return;
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
    MainApp12.prototype.updateParticles = function () {
        this.pointCloud.rotation.y += this.xSpeed;
        var Count = this.particleCount;
        while (Count--) {
            var particle = this.particles.vertices[Count];
            if (particle.y < -400) {
                particle.y = 400;
                particle.velocity.y = -Math.random();
            }
            particle.y -= Math.random() * this.ySpeed;
            particle.add(particle.velocity);
        }
        this.pointCloud.geometry.verticesNeedUpdate = true;
    };
    MainApp12.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    MainApp12.prototype.animate = function () {
        var _this = this;
        this.update();
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
    };
    return MainApp12;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp12();
    main.animate();
});
