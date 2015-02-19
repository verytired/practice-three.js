class MainApp10 {

		private source;
		private animationId;
		private audioContext = new AudioContext();
		private fileReader = new FileReader();

		constructor() {

				var analyser = this.audioContext.createAnalyser();
				analyser.fftSize = 128;
				analyser.connect(this.audioContext.destination);

				var canvas = document.getElementById('visualizer');
				var canvasContext = canvas.getContext('2d');
				canvas.setAttribute('width', analyser.frequencyBinCount * 10);

				this.fileReader.onload = ()=> {
						this.audioContext.decodeAudioData(this.fileReader.result, (buffer)=> {
								if (this.source) {
										this.source.stop();
										cancelAnimationFrame(this.animationId);
								}
								this.source = this.audioContext.createBufferSource();
								this.source.buffer = buffer;
								this.source.connect(analyser);
								this.source.start(0);
								this.animationId = requestAnimationFrame(render);
						});
				}

				document.getElementById('file').addEventListener('change', (e)=> {
						this.fileReader.readAsArrayBuffer(e.target.files[0]);
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
}


window.addEventListener("load", (e) => {
		console.log("loaded");
		var main:MainApp10 = new MainApp10();
});
