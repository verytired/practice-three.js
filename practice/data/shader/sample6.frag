precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    float f = 0.01 / abs(length(p) - 1.0);
    gl_FragColor = vec4(vec3(f), 1.0);
}