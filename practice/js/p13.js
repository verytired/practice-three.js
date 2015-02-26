/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="DefinitelyTyped/tween.js/tween.js.d.ts" />
var MainApp13 = (function () {
    function MainApp13() {
        var _this = this;
        this.mouse = new THREE.Vector2();
        this.onWindowResize = function () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        //1.カメラ追加
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 0, 1000);
        //2.シーン追加
        this.scene = new THREE.Scene();
        this.scene.add(this.camera);
        //3.レンダラー追加
        this.renderer = new THREE.WebGLRenderer({
            preserveDrawingBuffer: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xffffff);
        this.renderer.shadowMapEnabled = true;
        //4.表示コンテナ指定
        this.container = document.getElementById('container');
        this.container.appendChild(this.renderer.domElement);
        //リサイズ処理
        this.onWindowResize();
        window.addEventListener("resize", this.onWindowResize, false);
        //5 オブジェクト追加
        //光源追加
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 100, 30);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        /*var light = new THREE.PointLight(0xff0000);
        light.position.set(500, 500, 0);
        scene.add(light);*/
        //座標軸追加
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        //マウス制御機能追加
        //				this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        //				this.container.addEventListener("mousemove", ((e) => {
        //						var mouseX, mouseY;
        //						mouseX = e.clientX - 600 / 2;
        //						mouseY = e.clientY - 400 / 2;
        //				}), false);
        this.controls = new THREE.OrbitControls(this.camera);
        // SKYBOX
        var urls = ['data/skybox/01.jpg', 'data/skybox/02.jpg', 'data/skybox/03.jpg', 'data/skybox/04.jpg', 'data/skybox/05.jpg', 'data/skybox/06.jpg'];
        this.skyboxScene = new THREE.Scene();
        this.skyboxCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        var textureCube = THREE.ImageUtils.loadTextureCube(urls);
        var material2 = new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube });
        var shader = THREE.ShaderLib["cube"];
        shader.uniforms["tCube"].value = textureCube;
        var material3 = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        var skybox = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), material3);
        this.skyboxScene.add(skybox);
        //cube追加
        var geometry = new THREE.BoxGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 120, 120);
        cube.castShadow = true;
        this.skyboxScene.add(cube);
        /*** ADDING SCREEN SHOT ABILITY ***/
        window.addEventListener("keyup", function (e) {
            var imgData, imgNode;
            //Listen to 'P' key
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
    MainApp13.prototype.update = function () {
        this.controls.update();
    };
    MainApp13.prototype.render = function () {
        //位置を追従させる
        this.skyboxCamera.rotation.copy(this.camera.rotation);
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
