precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
    float a = gl_FragCoord.x / 512.0;
    gl_FragColor = vec4(vec3(a),1.0); //gl_FragColor = vec4(vec3(a,a,a),1.0)と同等;
}