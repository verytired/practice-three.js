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
        this.audioManager = new AudioManager(function () {
            _this.audioManager.play();
            _this.render();
        }, this);
        this.canvas = document.getElementById('visualizer');
        this.canvasContext = this.canvas.getContext('2d');
        this.canvas.setAttribute('width', this.audioManager.getAnalyser().frequencyBinCount * 10);
    }
    MainApp10.prototype.render = function () {
        var _this = this;
        console.log("render");
        //描画前にスペクトラムを取得する
        var spectrums = this.audioManager.getSpectrum();
        //描画
        //spectrums 0 - 200の範囲
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0, len = spectrums.length; i < len; i++) {
            this.canvasContext.fillRect(i * 10, 0, 5, spectrums[i]);
        }
        this.animationId = requestAnimationFrame(function () {
            _this.render();
        });
    };
    return MainApp10;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp10();
});
