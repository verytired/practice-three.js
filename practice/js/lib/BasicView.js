var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BasicView = (function (_super) {
    __extends(BasicView, _super);
    function BasicView() {
        _super.call(this);
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
        this.axis = new THREE.AxisHelper(1000);
        this.axis.position.set(0, 0, 0);
        this.axis.visible = false;
        this.scene.add(this.axis);
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
    }
    BasicView.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) {
            _this.animate();
        });
        this.update();
        this.render();
        if (this.stats)
            this.stats.update();
    };
    BasicView.prototype.update = function () {
        this.emit("update");
    };
    BasicView.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    BasicView.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    BasicView.prototype.setAxis = function (flag) {
        this.axis.visible = flag;
    };
    return BasicView;
})(EventEmitter2);
