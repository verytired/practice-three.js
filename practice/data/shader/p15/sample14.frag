//距離を求める関数を細工する事によって角が丸い四角形のような形状にする。

uniform vec2 resolution;
uniform float time;

float lengthN(vec2 v, float n)
{
  vec2 tmp = pow(abs(v), vec2(n));
  return pow(tmp.x+tmp.y, 1.0/n);
}

float rings(vec2 p)
{
  return sin(lengthN(p, 4.0)*16.0);
}

void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;

  gl_FragColor = vec4(rings(pos));
}
