//sin関数に中心からの距離を入れることによって同心円状のリングを生成する。

uniform vec2 resolution;
uniform float time;

float rings(vec2 p)
{
  return sin(length(p)*16.0);
}

void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;

  gl_FragColor = vec4(rings(pos));
}