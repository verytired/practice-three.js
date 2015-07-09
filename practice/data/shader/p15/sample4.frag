precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    //p.x += 1.0; // ← 正規化済みの座標の X に 1.0 を足す  -1.0だった箇所が0となりそこが原点となる
    p += vec2(cos(time), sin(time)) * 1.0;
    float l = 0.1 / length(p);
    gl_FragColor = vec4(vec3(l), 1.0);
}