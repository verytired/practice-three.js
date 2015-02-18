//定義ファイル
/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
var MainApp09 = (function () {
    function MainApp09() {
        this.onWindowResize = function () {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        //1.カメラ追加
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 70, 70);
        //2.シーン追加
        this.scene = new THREE.Scene();
        //3.レンダラー追加
        this.renderer = new THREE.WebGLRenderer();
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
        //座標軸追加
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        //光源追加
        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 100, 30);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        //cube追加
        var geometry = new THREE.CubeGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: true });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 60, 0);
        cube.castShadow = true;
        this.scene.add(cube);
        this.geometry2 = new THREE.PlaneGeometry(150, 150, 64, 64);
        material = new THREE.MeshPhongMaterial({ color: 0x3333333, wireframe: false });
        var ground = new THREE.Mesh(this.geometry2, material);
        ground.rotation.x = Math.PI / -2;
        this.scene.add(ground);
        var pn = new SimplexNoise();
        for (var i = 0; i < this.geometry2.vertices.length; i++) {
            var vertex = this.geometry2.vertices[i];
            vertex.z = pn.noise(vertex.x / 20, vertex.y / 20);
        }
        this.geometry2.computeFaceNormals();
        this.geometry2.computeVertexNormals();
        //マウス制御機能追加
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.container.addEventListener("mousemove", (function (e) {
            var mouseX, mouseY;
            mouseX = e.clientX - 600 / 2;
            mouseY = e.clientY - 400 / 2;
        }), false);
    }
    MainApp09.prototype.update = function () {
        this.controls.update();
        //        for ( i = 0; i < this.geometry2.vertices.length; i++ ) {
        //            var vertex = this.geometry2.vertices[ i ];
        //            vertex.z = Math.random()*20;
        //        }
    };
    MainApp09.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    MainApp09.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
    };
    return MainApp09;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp09();
    main.animate();
});
