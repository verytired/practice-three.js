var AudioManager = (function () {
    function AudioManager(callback, callbackObj) {
        var _this = this;
        this.audioContext = new AudioContext();
        this.fileReader = new FileReader();
        this.isPlaySound = false;
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.connect(this.audioContext.destination);
        this.fileReader.onload = function () {
            _this.audioContext.decodeAudioData(_this.fileReader.result, function (buffer) {
                _this.source = _this.audioContext.createBufferSource();
                _this.source.buffer = buffer;
                _this.source.connect(_this.analyser);
                _this.isPlaySound = true;
                if (callback != null && callbackObj != null)
                    callback.apply(callbackObj);
            });
        };
        document.getElementById('file').addEventListener('change', function (e) {
            _this.fileReader.readAsArrayBuffer(e.target.files[0]);
        });
    }
    AudioManager.prototype.play = function () {
        if (this.isPlaySound == true) {
            this.source.start(0);
        }
    };
    AudioManager.prototype.getSpectrum = function () {
        var spectrums = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(spectrums);
        return spectrums;
    };
    AudioManager.prototype.getAnalyser = function () {
        return this.analyser;
    };
    return AudioManager;
})();
var MainApp10 = (function () {
    function MainApp10() {
        var _this = this;
        this.isWireFrame = false;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 70, 70);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            clearColor: 0x000000,
            clearAlpha: 0,
            alpha: true,
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
        var geometry = new THREE.CubeGeometry(40, 40, 40);
        this.material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.cube = new THREE.Mesh(geometry, this.material);
        this.cube.position.set(0, 0, 0);
        this.cube.castShadow = true;
        this.scene.add(this.cube);
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.container.addEventListener("mousemove", (function (e) {
            var mouseX, mouseY;
            mouseX = e.clientX - 600 / 2;
            mouseY = e.clientY - 400 / 2;
        }), false);
        this.audioManager = new AudioManager(function () {
            _this.audioManager.play();
            _this.animate();
        }, this);
        this.canvas = document.getElementById('visualizer');
        this.canvasContext = this.canvas.getContext('2d');
        this.canvas.setAttribute('width', this.audioManager.getAnalyser().frequencyBinCount * 10);
        var gui = new dat.GUI();
        var wireframeControl = gui.add(this, 'isWireFrame');
        wireframeControl.onChange(function (value) {
            _this.material.wireframe = value;
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
    MainApp10.prototype.onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    MainApp10.prototype.update = function () {
        this.spectrums = this.audioManager.getSpectrum();
    };
    MainApp10.prototype.draw = function (spectrums) {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0, len = spectrums.length; i < len; i++) {
            this.canvasContext.fillRect(i * 10, 0, 5, spectrums[i]);
        }
    };
    MainApp10.prototype.render = function () {
        var d = this.spectrums[7];
        this.cube.scale.set(d / 100, d / 100, d / 100);
        this.renderer.render(this.scene, this.camera);
    };
    MainApp10.prototype.animate = function () {
        var _this = this;
        this.update();
        this.draw(this.spectrums);
        requestAnimationFrame(function (e) { return _this.animate(); });
        this.render();
    };
    return MainApp10;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp10();
    main.animate();
});
