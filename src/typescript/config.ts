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
