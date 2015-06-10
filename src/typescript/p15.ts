/**
 * Created by yutaka.sano on 2015/06/10.
 */
//定義ファイル
/// <reference path="DefinitelyTyped/threejs/three.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="DefinitelyTyped/jquery/jquery.d.ts" />

class MainApp15 {
	private scene:THREE.Scene;
	private camera:THREE.Camera;
	private renderer;
	private container;
	private stats;
	private uniforms;
	private vs;
	private fg;

	constructor() {
		this.container = document.getElementById('container');
		this.camera = new THREE.Camera();
		this.camera.position.z = 1;

		this.scene = new THREE.Scene();

		this.uniforms = {
			time: {type: "f", value: 1.0},
			resolution: {type: "v2", value: new THREE.Vector2()}
		};

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.container.appendChild(this.renderer.domElement);

		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		this.container.appendChild(this.stats.domElement);

		this.onWindowResize()
		window.addEventListener("resize", (e)=> {
			this.onWindowResize()
		}, false);

	}

	private makeMesh() {

		var geometry = new THREE.PlaneBufferGeometry(2, 2);

		var material = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: this.vs,
			fragmentShader: this.fg,
		});

		var mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);
		this.animate()
	}

	private onWindowResize = function () {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.uniforms.resolution.value.x = this.renderer.domElement.width;
		this.uniforms.resolution.value.y = this.renderer.domElement.height;
	};

	private render() {
		this.uniforms.time.value += 0.05;
		this.renderer.render(this.scene, this.camera);
	}

	public animate() {
		requestAnimationFrame((e)=>
				this.animate()
		);
		this.render();
		this.stats.update();
	}

	public loadShader(vertexPath, fragmentPath) {
		$.ajax({
			url: vertexPath,
			success: (data)=> {
				this.vs = data
				if (this.fg != undefined) {
					this.makeMesh()
				}
			}
		});
		$.ajax({
			url: fragmentPath,
			success: (data)=> {
				this.fg = data
				if (this.vs != undefined) {
					this.makeMesh()
				}
			}
		});
	}
}

window.addEventListener("load", (e) => {
	var main:MainApp15 = new MainApp15();
	main.loadShader('data/shader/simple.vert', 'data/shader/simple.frag');
});
