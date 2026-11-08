// tweak values here
const YELLOW = '#F4D671';
const PINK   = '#FA84CC', PINK_OPACITY = 0.8;
const PINK_AT    = 0.5;   // where pink sits in the gradient (0–1)
const PINK_WIDTH = 0.12;  // width of the pink band
const ZOOM   = 1.03;
const DETAIL = 1.62;
const MORPH  = 6.69;
const SCROLL = 0.25;     // leftward scroll speed (0 = off, negative = right)

const c = document.getElementById('bg'), gl = c.getContext('webgl');
const rgb = h => [1,3,5].map(i => parseInt(h.substr(i,2),16)/255);
const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
const p = gl.createProgram();
gl.attachShader(p, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}'));
gl.attachShader(p, sh(gl.FRAGMENT_SHADER, `
precision highp float;
uniform vec2 r; uniform float t, s, z, d, at, w, op; uniform vec3 A, B;
float h(vec3 p){p.xz=mod(p.xz,64.);return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5);}
float n(vec3 p){vec3 i=floor(p),f=fract(p);f*=f*(3.-2.*f);
  return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x),mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x),mix(h(i+vec3(0,1,1)),h(i+1.),f.x),f.y),f.z);}
void main(){
  vec3 p=vec3(gl_FragCoord.xy/r.y*1.5/z+vec2(s,0),t);
  float v=0.,a=.5;
  for(int i=0;i<4;i++){ if(float(i)>d) break; v+=a*n(p); p*=2.; a*=.5; }
  v/=1.-2.*a;
  gl_FragColor=vec4(mix(A,B,(1.-smoothstep(0.,w,abs(v-at)))*op),1);
}`));
gl.linkProgram(p); gl.useProgram(p);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

const u = k => gl.getUniformLocation(p, k), uT = u('t'), uS = u('s');
gl.uniform3fv(u('A'), rgb(YELLOW)); gl.uniform3fv(u('B'), rgb(PINK));
gl.uniform1f(u('z'), ZOOM); gl.uniform1f(u('d'), DETAIL);
gl.uniform1f(u('at'), PINK_AT); gl.uniform1f(u('w'), PINK_WIDTH); gl.uniform1f(u('op'), PINK_OPACITY);

const fit = () => {
  c.width = innerWidth; c.height = innerHeight;
  gl.viewport(0, 0, c.width, c.height);
  gl.uniform2f(u('r'), c.width, c.height);
};
addEventListener('resize', fit); fit();

(function f(ms){
  gl.uniform1f(uT, (ms/1000 * MORPH * 0.05) % 64);  // loops seamlessly, runs forever
  gl.uniform1f(uS, ((ms/1000 * SCROLL) % 64 + 64) % 64);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  requestAnimationFrame(f);
})(0);