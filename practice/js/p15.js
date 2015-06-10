/**
 * Created by yutaka.sano on 2015/06/10.
 */
//定義ファイル
/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="DefinitelyTyped/jquery/jquery.d.ts" />
var MainApp15 = (function () {
    function MainApp15() {
        var _this = this;
        this.onWindowResize = function () {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.uniforms.resolution.value.x = this.renderer.domElement.width;
            this.uniforms.resolution.value.y = this.renderer.domElement.height;
        };
        this.container = document.getElementById('container');
        this.camera = new THREE.Camera();
        this.camera.position.z = 1;
        this.scene = new THREE.Scene();
        this.uniforms = {
            time: { type: "f", value: 1.0 },
            resolution: { type: "v2", value: new THREE.Vector2() }
        };
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
    MainApp15.prototype.makeMesh = function () {
        var geometry = new THREE.PlaneBufferGeometry(2, 2);
        var material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vs,
            fragmentShader: this.fg
        });
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        this.animate();
    };
    MainApp15.prototype.render = function () {
        this.uniforms.time.value += 0.05;
        this.renderer.render(this.scene, this.camera);
    };
    MainApp15.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) {
            return _this.animate();
        });
        this.render();
        this.stats.update();
    };
    MainApp15.prototype.loadShader = function (vertexPath, fragmentPath) {
        var _this = this;
        $.ajax({
            url: vertexPath,
            success: function (data) {
                _this.vs = data;
                if (_this.fg != undefined) {
                    _this.makeMesh();
                }
            }
        });
        $.ajax({
            url: fragmentPath,
            success: function (data) {
                _this.fg = data;
                if (_this.vs != undefined) {
                    _this.makeMesh();
                }
            }
        });
    };
    return MainApp15;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp15();
    main.loadShader('data/shader/simple.vert', 'data/shader/simple.frag');
});
