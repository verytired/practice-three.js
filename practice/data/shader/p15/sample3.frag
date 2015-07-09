precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // 正規化ｘ,yの範囲をそれぞれ-1 ~ 1になるように変換
    //float l = 0.1 / length(p); //原点に近い程0になる
    float l = 0.1 * abs(sin(time)) / length(p);
    gl_FragColor = vec4(vec3(l), 1.0);
}