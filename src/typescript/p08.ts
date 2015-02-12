//定義ファイル
/// <reference path="three.d.ts" />
/// <reference path="jquery.d.ts" />

//extension/shaderを使えるようにする
declare module THREE {
    export var OrbitControls;
    //effect
    export var EffectComposer;
    export var RenderPass;
    export var ShaderPass;
    export var DotScreenShader;
    export var DotMatrixShader;
    export var RGBShiftShader;
    export var CopyShader;
}

class MainApp08 {
    private scene:THREE.Scene;
    private camera:THREE.PerspectiveCamera;
    private renderer;
    private controls;
    private composer;

    constructor() {
        console.log("main app constructor");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 70, 70);

        if (WebGLRenderingContext) {//window参照しなくていい
            this.renderer = new THREE.WebGLRenderer();
        } else {
            this.renderer = new THREE.CanvasRenderer();
        }
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff);
        this.renderer.shadowMapEnabled = true;

        var container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);

        var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
        directionalLight.position.set(0, 100, 30);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        var geometry = new THREE.CubeGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 60, 0);
        cube.castShadow = true;
        this.scene.add(cube);
        var geometry2 = new THREE.CubeGeometry(20, 20, 20);
        var material2 = new THREE.MeshPhongMaterial({color: 0x0000ff});
        var cube2 = new THREE.Mesh(geometry2, material2);
        cube2.position.set(0, 50, -50);
        cube2.castShadow = true;
        this.scene.add(cube2);
        var pGeometry = new THREE.PlaneGeometry(300, 300);
        var pMaterial = new THREE.MeshLambertMaterial({
            color: 0x666666,
            side: THREE.DoubleSide
        });
        var plane = new THREE.Mesh(pGeometry, pMaterial);
        plane.position.set(0, 0, 0);
        plane.rotation.x = 90 * Math.PI / 180;
        plane.receiveShadow = true;
        this.scene.add(plane);
        var axis = new THREE.AxisHelper(1000);
        axis.position.set(0, 0, 0);
        this.scene.add(axis);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        container.addEventListener("mousemove", ((e) => {
            var mouseX, mouseY;
            mouseX = e.clientX - 600 / 2;
            mouseY = e.clientY - 400 / 2;
            cube.rotation.x = mouseY * 0.005;
            cube.rotation.y = mouseX * 0.005;
            cube2.rotation.y = mouseY * 0.005;
            cube2.rotation.z = mouseX * 0.005;
        }), false);

        window.addEventListener("resize", this.onWindowResize, false);

        //effect
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
        var effect = new THREE.ShaderPass(THREE.DotScreenShader);
        effect.uniforms["scale"].value = 1;
        var dotMatrixPass = new THREE.ShaderPass(THREE.DotMatrixShader);
        dotMatrixPass.uniforms["size"].value = 10;
        this.composer.addPass(dotMatrixPass);
        effect = new THREE.ShaderPass(THREE.RGBShiftShader);
        effect.uniforms["amount"].value = 0.0015;
        this.composer.addPass(effect);
        var toScreen = new THREE.ShaderPass(THREE.CopyShader);
        this.composer.addPass(toScreen);
        toScreen.renderToScreen = true;
    }

    private onWindowResize = function () {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    private render() {
//        this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }

    private update() {
        this.controls.update();
    }

    public animate() {
        requestAnimationFrame((e)=>
                this.animate()
        );
        this.render();

        this.update();
    }

    // todo shader loading
    private requestShader(onShadersLoaded) {

        var loadedShaders = {};

        // Get all of the shaders from the DOM
        var vertexShaders = $('script[type="x-shader/x-vertex"]');
        var fragmentShaders = $('script[type="x-shader/x-fragment"]');

        var unloadedRemaining = vertexShaders.length + fragmentShaders.length;

        var checkForRemaining = function () {
            if (unloadedRemaining <= 0 && onShadersLoaded) {
                onShadersLoaded(loadedShaders);
            }
        }

        /**
         * Loads an external shader file asynchronously using AJAX
         *
         * @param {Object} The shader script tag from the DOM
         * @param {String} The type of shader [vertex|fragment]
         */
        var loadShaderFile = function (shaderElement, type) {
            /**
             * Processes a shader that comes back from
             * the AJAX and stores it in the Shaders
             * Object for later on
             *
             * @param {Object} The jQuery XHR object
             * @param {String} The response text, e.g. success, error
             */
            var onComplete = function onComplete(jqXHR, textStatus) {
                --unloadedRemaining;

                if (!loadedShaders[name]) {
                    loadedShaders[name] = {
                        vertex: "",
                        fragment: ""
                    };
                }

                loadedShaders[name][type] = jqXHR.responseText;

                checkForRemaining();
            }

            var element = $(shaderElement);
            var url = element.data("src");
            var name = element.data("name");

            $.ajax(
                {
                    url: url,
                    dataType: "text",
                    context: {
                        name: name,
                        type: type
                    },
                    complete: onComplete
                }
            );
        }

        // Load vertex shaders
        var shader;
        var i, shaderCount;
        for (i = 0, shaderCount = vertexShaders.length; i < shaderCount; ++i) {
            shader = vertexShaders[i];
            //loadShaderFile(shader, "vertex");
        }

        // Load fragment shaders
        for (i = 0, shaderCount = fragmentShaders.length; i < shaderCount; ++i) {
            shader = fragmentShaders[i];
            loadShaderFile(shader, "fragment");
        }
    }
}

window.addEventListener("load", (e) => {
    console.log("loaded");
    var main:MainApp08 = new MainApp08();
});
