precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	//グリッド位置算出
	//間隔ずつとり半径分戻すことで中心位置算出　
	vec2 q = mod(p, 0.3) - 0.15;

	float s = sin(time);
	float c = cos(time);
    //座標の回転
	p *= mat2(c, s, -s, c);
    q *= mat2(c, s, -s, c);

	float v = 0.1 / abs(q.y) * abs(q.x);
	//回転周期によって色を変更
	float r = v * abs(sin(time * 6.0) + 1.5);
	float g = v * abs(sin(time * 4.5) + 1.5);
	float b = v * abs(sin(time * 3.0) + 1.5);
	gl_FragColor = vec4(r, g, b, 1.0);
}
