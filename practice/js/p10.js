var MainApp10 = (function () {
    function MainApp10() {
        var _this = this;
        this.audioContext = new AudioContext();
        this.fileReader = new FileReader();
        var analyser = this.audioContext.createAnalyser();
        analyser.fftSize = 128;
        analyser.connect(this.audioContext.destination);
        var canvas = document.getElementById('visualizer');
        var canvasContext = canvas.getContext('2d');
        canvas.setAttribute('width', analyser.frequencyBinCount * 10);
        this.fileReader.onload = function () {
            _this.audioContext.decodeAudioData(_this.fileReader.result, function (buffer) {
                if (_this.source) {
                    _this.source.stop();
                    cancelAnimationFrame(_this.animationId);
                }
                _this.source = _this.audioContext.createBufferSource();
                _this.source.buffer = buffer;
                _this.source.connect(analyser);
                _this.source.start(0);
                _this.animationId = requestAnimationFrame(render);
            });
        };
        document.getElementById('file').addEventListener('change', function (e) {
            _this.fileReader.readAsArrayBuffer(e.target.files[0]);
        });
        var render = function () {
            var spectrums = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(spectrums);
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0, len = spectrums.length; i < len; i++) {
                canvasContext.fillRect(i * 10, 0, 5, spectrums[i]);
            }
            this.animationId = requestAnimationFrame(render);
        };
    }
    return MainApp10;
})();
window.addEventListener("load", function (e) {
    console.log("loaded");
    var main = new MainApp10();
});
