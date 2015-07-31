/// <reference path="../../typings/tsd.d.ts"/>

/**
 * three.js簡易初期化用クラス
 */
class BasicView extends EventEmitter2 {

    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;

    private stats: Stats;
    private axis: THREE.AxisHelper;
    private controls: THREE.OrbitControls;

    constructor() {
        super();
        var WIDTH = window.innerWidth;
        var HEIGHT = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 1, 10000);
        this.camera.position.z = 300;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x050505);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(WIDTH, HEIGHT);

        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);

        this.axis = new THREE.AxisHelper(1000);
        this.axis.position.set(0, 0, 0);
        this.axis.visible = false;
        this.scene.add(this.axis);

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        container.appendChild(this.stats.domElement);

        this.controls = new THREE.OrbitControls(this.camera);
    }

    /**
     * 描画開始
     */
    public animate(): void {
        requestAnimationFrame((e) => { this.animate() });
        this.render();
        this.update()
        if (this.controls) this.controls.update();
        if (this.stats) this.stats.update();
    }

    /**
     * 更新処理実行
     */
    public update(): void {
        this.emit("update");
    }

    /**
     * レンダリング
     */
    public render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * リサイズ処理
     */
    private onWindowResize(): void {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * 座標軸表示
     * @param  {boolean} flag 表示/非表示
     */
    public setAxis(flag: boolean): void {
        this.axis.visible = flag
    }

    /**
     * sceneにオブジェクト追加
     * @param  {THREE.Object3D} obj 追加するオブジェクトon]
     */
    public add(obj: THREE.Object3D): void {
        this.scene.add(obj);
    }

    /**
     * sceneからオブジェクト削除
     * @param  {THREE.Object3D} obj 削除するオブジェクト
     */
    public remove(obj: THREE.Object3D): void {
        this.scene.remove(obj);
    }

}
