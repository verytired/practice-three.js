/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="DefinitelyTyped/dat-gui/dat-gui.d.ts" />

class AudioManager {

		private source;
		private audioContext = new AudioContext();
		private fileReader = new FileReader();
		private analyser;
		private isPlaySound: Boolean = false;

		private callbackBuffer;
		private callbackBufferObj;

		constructor(callback, callbackObj) {

				//analyser test
				this.analyser = this.audioContext.createAnalyser();
				this.analyser.fftSize = 128;
				this.analyser.connect(this.audioContext.destination);

				//loading audio file
				this.fileReader.onload = () => {
						//ロード完了後buffer取得開始
						this.audioContext.decodeAudioData(this.fileReader.result, (buffer) => {
								this.source = this.audioContext.createBufferSource();
								this.source.buffer = buffer;
								this.source.connect(this.analyser);
								this.isPlaySound = true;
								//onload callback
								if (callback != null && callbackObj != null) callback.apply(callbackObj);
						});
				}

				//view fileName
				document.getElementById('file').addEventListener('change', (e: any) => {
						this.fileReader.readAsArrayBuffer(e.target.files[0]);
				});
		}

  /**
   * 再生開始
   */
		public play() {
				if (this.isPlaySound == true) {
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
		private scene: THREE.Scene;
		private camera: THREE.PerspectiveCamera;
		private renderer;
		private container;
		private controls;
		private cube;
		private material;
		private isWireFrame: Boolean = false;
		private animationId;
		private audioManager: AudioManager;
		private canvas;
		private canvasContext;
		private spectrums;


		constructor() {

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
				window.addEventListener("resize", (e) => { this.onWindowResize() }, false);

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
				this.container.addEventListener("mousemove", ((e) => {
						var mouseX, mouseY;
						mouseX = e.clientX - 600 / 2;
						mouseY = e.clientY - 400 / 2;
				}), false);


				this.audioManager = new AudioManager(() => {
						this.audioManager.play();
						this.animate()
				}, this);

				this.canvas = document.getElementById('visualizer');
				this.canvasContext = this.canvas.getContext('2d');
				this.canvas.setAttribute('width', this.audioManager.getAnalyser().frequencyBinCount * 10);


				var gui = new dat.GUI();
				var wireframeControl = gui.add(this, 'isWireFrame');
				wireframeControl.onChange((value) => {
						this.material.wireframe = value
				});

				/*** ADDING SCREEN SHOT ABILITY ***/
				window.addEventListener("keyup", (e) => {
						var imgData, imgNode;
						//Listen to 'P' key
						if (e.which !== 80) return;
						try {
								imgData = this.renderer.domElement.toDataURL();
								console.log(imgData);
						}
						catch (e) {
								console.log(e)
								console.log("Browser does not support taking screenshot of 3d context");
								return;
						}
				});
		}

		private onWindowResize() {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
		}

		private update() {
				this.spectrums = this.audioManager.getSpectrum();
				//this.draw(spectrums);
		}

		private draw(spectrums) {
				//描画
				//spectrums 0 - 200の範囲

				this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
				for (var i = 0, len = spectrums.length; i < len; i++) {
						this.canvasContext.fillRect(i * 10, 0, 5, spectrums[i]);
				}
		}

		private render() {
				var d = this.spectrums[7];
				//this.cube.position.y = d
				this.cube.scale.set(d / 100, d / 100, d / 100);
				this.renderer.render(this.scene, this.camera);
		}

		public animate() {
				this.update();
				this.draw(this.spectrums);

				requestAnimationFrame((e) =>
						this.animate()
      );
				this.render();
		}
}

window.addEventListener("load", (e) => {
		var main: MainApp10 = new MainApp10();
		main.animate();
});
