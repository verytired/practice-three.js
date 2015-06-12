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
        this.controls = new THREE.OrbitControls(this.camera);
        // SKYBOX
        //画像の順序は左、右、上、下、奥、手前です。
        var urls = ['data/skybox/cubemap1_left.png',
            'data/skybox/cubemap1_right.png',
            'data/skybox/cubemap1_up.png',
            'data/skybox/cubemap1_down.png',
            'data/skybox/cubemap1_front.png',
            'data/skybox/cubemap1_back.png'];
        this.skyboxScene = new THREE.Scene();
        this.skyboxCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        var textureCube = THREE.ImageUtils.loadTextureCube(urls);
        var shader = THREE.ShaderLib["cube"]; //1.標準シェーダー定義からcube用シェーダーを取得
        shader.uniforms["tCube"].value = textureCube; //2.シェーダーにtextureを指定
        //3.shaderMaterialを生成 読み込んだtextureを適用させる
        //裏面だけに描画するように指定
        var skyboxMaterial = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });
        //4.Meshを生成する
        var skybox = new THREE.Mesh(new THREE.CubeGeometry(400, 400, 400), skyboxMaterial);
        this.skyboxScene.add(skybox);
        //cube追加
        var cube = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshPhongMaterial({ color: 0x0000ff }));
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
        this.skyboxCamera.position.copy(this.camera.position);
        this.renderer.render(this.scene, this.camera);
        this.renderer.render(this.skyboxScene, this.skyboxCamera);
    };
    MainApp13.prototype.animate = function () {
        var _this = this;
        this.update();
        requestAnimationFrame(function (e) {
            return _this.animate();
        });
        this.render();
    };
    return MainApp13;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp13();
    main.animate();
});
