uniform vec2 resolution;
uniform float time;

vec3 trans(vec3 p)
{
  return mod(p, 8.0)-4.0;
}

float lengthN(vec3 v, float n)
{
  vec3 tmp = pow(abs(v), vec3(n));
  return pow(tmp.x+tmp.y+tmp.z, 1.0/n);
}

float distanceFunction(vec3 pos)
{
  return lengthN(trans(pos), 4.0) - 1.0;
  //return length(pos) - 1.0;
}

vec3 getNormal(vec3 p)
{
  const float d = 0.0001;
  return
    normalize
    (
      vec3
      (
        distanceFunction(p+vec3(d,0.0,0.0))-distanceFunction(p+vec3(-d,0.0,0.0)),
        distanceFunction(p+vec3(0.0,d,0.0))-distanceFunction(p+vec3(0.0,-d,0.0)),
        distanceFunction(p+vec3(0.0,0.0,d))-distanceFunction(p+vec3(0.0,0.0,-d))
      )
    );
}

void main() {
  //正規化
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;

  //カメラの位置, 向きと焦点距離を決めて, レイの位置と向きを決める。
  vec3 camPos = vec3(0.0, 0.0, 0.0);
  vec3 camDir = vec3(0.0, 0.0, -1.0);
  vec3 camUp = vec3(0.0, 1.0, 0.0);
  vec3 camSide = cross(camDir, camUp);
  float focus = 1.8;

  vec3 rayDir = normalize(camSide*pos.x + camUp*pos.y + camDir*focus);


	//球のDistance function(distaceFunction)を定義。
	//マーチングループを追加する。
	//レイがヒットしたら白く表示。
	//Distance functionの返す距離が十分小さいならばヒットしたとみなす。
  float t = 0.0, d;
  vec3 posOnRay = camPos;

  for(int i=0; i<64; ++i)
  {
    d = distanceFunction(posOnRay);
    t += d;
    posOnRay = camPos + t*rayDir;
  }

  vec3 normal = getNormal(posOnRay);
  if(abs(d) < 0.001)
  {
    gl_FragColor = vec4(normal, 1.0);
  }else
  {
    gl_FragColor = vec4(0.0);
  }
}