precision mediump float;
uniform float time;
uniform vec2  resolution;

struct Ray{
    vec3 origin;
    vec3 direction;
};

struct Sphere{
    float radius;
    vec3  position;
    vec3  color;
};

struct Plane{
    vec3 position;
    vec3 normal;
    vec3 color;
};

struct Intersection{
    vec3 hitPoint;
    vec3 normal;
    vec3 color;
    float distance;
};

const vec3 lightDirection = vec3(0.577);

void intersectSphere(Ray R, Sphere S, inout Intersection I){
    vec3  a = R.origin - S.position;
    float b = dot(a, R.direction);
    float c = dot(a, a) - (S.radius * S.radius);
    float d = b * b - c;
    float t = -b - sqrt(d);
    if(d > 0.0 && t > 0.0 && t < I.distance){
        I.hitPoint = R.origin + R.direction * t;
        I.normal = normalize(I.hitPoint - S.position);
        d = clamp(dot(lightDirection, I.normal), 0.1, 1.0);
        I.color = S.color * d;
        I.distance = t;
    }
}

void intersectPlane(Ray R, Plane P, inout Intersection I){
    float d = -dot(P.position, P.normal);
    float v = dot(R.direction, P.normal);
    float t = -(dot(R.origin, P.normal) + d) / v;
    if(t > 0.0 && t < I.distance){
        I.hitPoint = R.origin + R.direction * t;
        I.normal = P.normal;
        float d = clamp(dot(I.normal, lightDirection), 0.1, 1.0);
        float m = mod(I.hitPoint.x, 2.0);
        float n = mod(I.hitPoint.z, 2.0);
        if((m > 1.0 && n > 1.0) || (m < 1.0 && n < 1.0)){
            d *= 0.5;
        }
        float f = 1.0 - min(abs(I.hitPoint.z), 25.0) * 0.04;
        I.color = P.color * d * f;
        I.distance = t;
    }
}

void main(void){
    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // ray init
    Ray ray;
    ray.origin = vec3(0.0, 2.0, 6.0);
    ray.direction = normalize(vec3(p.x, p.y, -1.0));

    // intersection init
    Intersection i;
    i.hitPoint = vec3(0.0);
    i.normal = vec3(0.0);
    i.color = vec3(0.0);
    i.distance = 1.0e+30;

    // sphere init
    Sphere sphere[3];
    sphere[0].radius = 0.5;
    sphere[0].position = vec3(0.0, -0.5, sin(time));
    sphere[0].color = vec3(1.0, 0.0, 0.0);
    sphere[1].radius = 1.0;
    sphere[1].position = vec3(2.0, 0.0, cos(time * 0.666));
    sphere[1].color = vec3(0.0, 1.0, 0.0);
    sphere[2].radius = 1.5;
    sphere[2].position = vec3(-2.0, 0.5, cos(time * 0.333));
    sphere[2].color = vec3(0.0, 0.0, 1.0);

    // plane init
    Plane plane;
    plane.position = vec3(0.0, -1.0, 0.0);
    plane.normal = vec3(0.0, 1.0, 0.0);
    plane.color = vec3(1.0);

    // hit check
    intersectSphere(ray, sphere[0], i);
    intersectSphere(ray, sphere[1], i);
    intersectSphere(ray, sphere[2], i);
    intersectPlane(ray, plane, i);
    gl_FragColor = vec4(i.color, 1.0);
}