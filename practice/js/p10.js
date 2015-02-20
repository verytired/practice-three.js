/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="DefinitelyTyped/dat-gui/dat-gui.d.ts" />
var AudioManager = (function () {
    function AudioManager(callback, callbackObj) {
        var _this = this;
        this.audioContext = new AudioContext();
        this.fileReader = new FileReader();
        this.isPlaySound = false;
        //analyser test
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.connect(this.audioContext.destination);
        //loading audio file
        this.fileReader.onload = function () {
            //ロード完了後buffer取得開始
            _this.audioContext.decodeAudioData(_this.fileReader.result, function (buffer) {
                _this.source = _this.audioContext.createBufferSource();
                _this.source.buffer = buffer;
                _this.source.connect(_this.analyser);
                _this.isPlaySound = true;
                //onload callback
                if (callback != null && callbackObj != null)
                    callback.apply(callbackObj);
            });
        };
        //view fileName
        document.getElementById('file').addEventListener('change', function (e) {
            _this.fileReader.readAsArrayBuffer(e.target.files[0]);
        });
    }
    /**
     * 再生開始
     */
    AudioManager.prototype.play = function () {
        if (this.isPlaySound == true) {
            this.source.start(0);
        }
    };
    /**
     * スペクトラム取得
     * @returns {Uint8Array}
     */
    AudioManager.prototype.getSpectrum = function () {
        //描画前にスペクトラムを取得する
        var spectrums = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(spectrums);
        return spectrums;
    };
    /**
     * アナライザー取得
     * @returns {any}
     */
    AudioManager.prototype.getAnalyser = function () {
        return this.analyser;
    };
    return AudioManager;
})();
var MainApp10 = (function () {
    function MainApp10() {
        var _this = this;
        this.isWireFrame = false;
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
        //cube追加
        var geometry = new THREE.CubeGeometry(40, 40, 40);
        this.material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        this.cube = new THREE.Mesh(geometry, this.material);
        this.cube.position.set(0, 0, 0);
        this.cube.castShadow = true;
        this.scene.add(this.cube);
        //座標軸追加
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);
        //マウス制御機能追加
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
    MainApp10.prototype.update = function () {
        this.spectrums = this.audioManager.getSpectrum();
        //this.draw(spectrums);
    };
    MainApp10.prototype.draw = function (spectrums) {
        //描画
        //spectrums 0 - 200の範囲
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0, len = spectrums.length; i < len; i++) {
            this.canvasContext.fillRect(i * 10, 0, 5, spectrums[i]);
        }
    };
    MainApp10.prototype.render = function () {
        var d = this.spectrums[7];
        //this.cube.position.y = d
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
