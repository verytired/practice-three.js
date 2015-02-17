//定義ファイル
/// <reference path="DefinitelyTyped/threejs/three.d.ts" />

class MainApp09 {
    private scene:THREE.Scene;
    private camera:THREE.Camera;
    private renderer;
    private container;
    private stats;
    private uniforms;
    
    constructor() {
        //1.表示コンテナ指定
        this.container = document.getElementById('container');
        //2.カメラ追加
        this.camera = new THREE.Camera();
        this.camera.position.z = 1;
        //3.シーン追加
        this.scene = new THREE.Scene();
        //4.レンダラー追加
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    private update() {

    }

    private render() {

    }

    public animate() {
        requestAnimationFrame((e)=>
                this.animate()
        );
        this.render();
    }
}

window.addEventListener("load", (e) => {
    console.log("test")
    var main:MainApp09 = new MainApp09();
    main.animate();
});
