declare module THREE {
		export var OrbitControls;
}

class MainApp11 {
		private scene:THREE.Scene;
		private camera:THREE.PerspectiveCamera;
		private renderer;
		private container;
		private controls;
		private mouse = new THREE.Vector2();
		private INTERSECTED;
		private raycaster;

		constructor() {

				//1.カメラ追加
				this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
				this.camera.position.set(0, 70, 70);

				//2.シーン追加
				this.scene = new THREE.Scene();

				//3.レンダラー追加
				this.renderer = new THREE.WebGLRenderer();
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
				var material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
				var cube = new THREE.Mesh(geometry, material);
				cube.position.set(0, 60, 0);
				cube.castShadow = true;
				this.scene.add(cube);
				//座標軸追加
//				var axis = new THREE.AxisHelper(1000);
//				axis.position.set(0, 0, 0);
//				this.scene.add(axis);

				//マウス制御機能追加
				this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
				this.container.addEventListener("mousemove", ((e) => {
						var mouseX, mouseY;
						mouseX = e.clientX - 600 / 2;
						mouseY = e.clientY - 400 / 2;
				}), false);

				//interactionテスト
				this.raycaster = new THREE.Raycaster();
				document.addEventListener('mousemove', ((e)=> {
						this.onDocumentMouseMove(e)
				}), false);
		}

		private onWindowResize = function () {
				this.camera.aspect = window.innerWidth / window.innerHeight;
				this.camera.updateProjectionMatrix();
				this.renderer.setSize(window.innerWidth, window.innerHeight);
		};

		private onDocumentMouseMove(event) {
				event.preventDefault();
				//mouse座標変更
				this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				this.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
		}

		private update() {
				// find intersections
				//mouseとcameraから当たり判定のあるオブジェクトを取得する
				this.raycaster.setFromCamera(this.mouse, this.camera);
				var intersects = this.raycaster.intersectObjects(this.scene.children);
				if (intersects.length > 0) {
						if (this.INTERSECTED != intersects[ 0 ].object) {
								if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
								this.INTERSECTED = intersects[ 0 ].object;
								this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
								this.INTERSECTED.material.emissive.setHex(0xff0000);
						}
				} else {
						if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
						this.INTERSECTED = null;
				}

		}

		private render() {
				this.renderer.render(this.scene, this.camera);
		}

		public animate() {
				this.update();
				requestAnimationFrame((e)=>
						this.animate()
				);
				this.render();
		}
}

window.addEventListener("load", (e) => {
		var main:MainApp11 = new MainApp11();
		main.animate();
});
