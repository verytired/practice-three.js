/// <reference path="DefinitelyTyped/threejs/three.d.ts" />      \
var MainApp16 = (function () {
    function MainApp16() {
        this.onWindowResize = function () {
            //	this.camera.aspect = window.innerWidth / window.innerHeight;
            //	this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };
        console.log("main app constructor");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 70, 70);
        if (WebGLRenderingContext) {
            this.renderer = new THREE.WebGLRenderer();
        }
        else {
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000);
        this.renderer.shadowMapEnabled = true;
        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        window.addEventListener("resize", this.onWindowResize, false);
        this.controls = new THREE.OrbitControls(this.camera);
        //shape test
        var curve = new THREE.QuadraticBezierCurve(new THREE.Vector3(-10, 0, 0), new THREE.Vector3(20, 15, 0), new THREE.Vector3(10, 0, 0));
        var path = new THREE.Path(curve.getPoints(50));
        var geometry = path.createPointsGeometry(50);
        var material = new THREE.LineBasicMaterial({ color: 0xffffff });
        var curveObject = new THREE.Line(geometry, material);
        this.scene.add(curveObject);
        //shape circle
        var loopShape = new THREE.Shape();
        var r = 50;
        loopShape.absarc(0, 0, r, 0, Math.PI * 2, false); //これで円を書いている？
        loopGeom = loopShape.createPointsGeometry(512 / 2); //shapeにgeometoryの頂点データを生成する
        loopGeom.dynamic = true;
        var m = new THREE.LineBasicMaterial({ color: 0xffffff,
            linewidth: 1,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        var line = new THREE.Line(loopGeom, m);
        console.log(loopGeom);
        var scale = 1;
        scale *= 1.05;
        line.scale.x = scale;
        line.scale.y = scale;
        this.scene.add(line);
        //z-index
        for (var j = 0; j < 512; j++) {
            loopGeom.vertices[j].z = Math.random(1000) * 10;
        }
        // link up last segment
        loopGeom.vertices[512].z = loopGeom.vertices[0].z;
    }
    MainApp16.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    MainApp16.prototype.update = function () {
        this.controls.update();
    };
    MainApp16.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function (e) {
            return _this.animate();
        });
        this.render();
        this.update();
    };
    return MainApp16;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp16();
    main.animate();
});
