class AudioManager {

		private source;
		private audioContext = new AudioContext();
		private fileReader = new FileReader();
		private analyser;
		private isPlaySound:Boolean = false;

		private callbackBuffer;
		private callbackBufferObj;

		constructor(callback, callbackObj) {

				//analyser test
				this.analyser = this.audioContext.createAnalyser();
				this.analyser.fftSize = 128;
				this.analyser.connect(this.audioContext.destination);


				//loading audio file
				this.fileReader.onload = ()=> {
						//ロード完了後buffer取得開始
						this.audioContext.decodeAudioData(this.fileReader.result, (buffer)=> {
								this.source = this.audioContext.createBufferSource();
								this.source.buffer = buffer;
								this.source.connect(this.analyser);
								this.isPlaySound = true;
								//onload callback
								if (callback != null && callbackObj != null) callback.apply(callbackObj);
						});
				}

				//view fileName
				document.getElementById('file').addEventListener('change', (e:any)=> {
						this.fileReader.readAsArrayBuffer(e.target.files[0]);
				});
		}

		/**
		 * 再生開始
		 */
		public play() {
				if (this.isPlaySound == true){
						this.source.start(0);
				}
		}

		/**
		 * スペクトラム取得
		 * @returns {Uint8Array}
		 */
		public getSpectrum() {
				//描画前にスペクトラムを取得する
				var spectrums = new Uint8Array(this.analyser.frequencyBinCount);
				this.analyser.getByteFrequencyData(spectrums);
				return spectrums
		}

		/**
		 * アナライザー取得
		 * @returns {any}
		 */
		public getAnalyser() {
				return this.analyser
		}
}

class MainApp10 {

		private animationId;
		private audioManager:AudioManager;
		private canvas;
		private canvasContext;

		constructor() {
				this.audioManager = new AudioManager(()=> {
						this.audioManager.play();
						this.render()
				}, this);

				this.canvas = document.getElementById('visualizer');
				this.canvasContext = this.canvas.getContext('2d');
				this.canvas.setAttribute('width', this.audioManager.getAnalyser().frequencyBinCount * 10);

		}

		private render(){
				console.log("render")
				//描画前にスペクトラムを取得する
				var spectrums = this.audioManager.getSpectrum();
				//描画
				//spectrums 0 - 200の範囲
				this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
				for (var i = 0, len = spectrums.length; i < len; i++) {
						this.canvasContext.fillRect(i * 10, 0, 5, spectrums[i]);
				}
				this.animationId = requestAnimationFrame(()=>{this.render()});
		}
}


window.addEventListener("load", (e) => {
		var main:MainApp10 = new MainApp10();
});
