var MainApp13 = (function () {
    function MainApp13() {
        var _this = this;
        this.mouse = new THREE.Vector2();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 0, 1000);
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);
        this.renderer = new THREE.WebGLRenderer({
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
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 100, 30);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        this.controls = new THREE.OrbitControls(this.camera);
        var urls = ['data/skybox/cubemap1_left.png', 'data/skybox/cubemap1_right.png', 'data/skybox/cubemap1_up.png', 'data/skybox/cubemap1_down.png', 'data/skybox/cubemap1_front.png', 'data/skybox/cubemap1_back.png'];
        this.skyboxScene = new THREE.Scene();
        this.skyboxCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        var textureCube = THREE.ImageUtils.loadTextureCube(urls);
        var shader = THREE.ShaderLib["cube"];
        shader.uniforms["tCube"].value = textureCube;
        var skyboxMaterial = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        var skybox = new THREE.Mesh(new THREE.CubeGeometry(400, 400, 400), skyboxMaterial);
        this.skyboxScene.add(skybox);
        var cube = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
        cube.position.set(0, 120, 120);
        cube.castShadow = true;
        this.skyboxScene.add(cube);
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
    MainApp13.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp13.prototype.update = function () {
        this.controls.update();
    };
    MainApp13.prototype.render = function () {
        this.skyboxCamera.rotation.copy(this.camera.rotation);
        this.skyboxCamera.position.copy(this.camera.position);
        this.renderer.render(this.scene, this.camera);
        this.renderer.render(this.skyboxScene, this.skyboxCamera);
    };
    MainApp13.prototype.animate = function () {
        var _this = this;
        this.update();
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
    };
    return MainApp13;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp13();
    main.animate();
});
