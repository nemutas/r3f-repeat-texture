uniform sampler2D u_texture;
uniform vec2 u_uvScale;
uniform vec2 u_textureOffset;
uniform vec2 u_mouseSpeed;
uniform float u_zoom;
uniform float u_zoomProgress;
uniform float u_aspect;
varying vec2 v_uv;

void main() {
  vec2 aspect = vec2(u_aspect, 1.0);

  // -------------------------
  // covered texture
  vec2 uv = (v_uv - 0.5) * u_uvScale + 0.5;

  // -------------------------
  // zoom
  vec2 toCenter = 0.5 - u_textureOffset;
  // uv = (uv - toCenter) * u_zoom + toCenter;
  uv -= toCenter;
  // distance from screen center
  vec2 dist = (uv - u_textureOffset) / u_uvScale * aspect;
  uv *= u_zoom;
  uv += toCenter;
  
  // -------------------------
  // translate
  uv -= u_textureOffset * u_zoom;

  // -------------------------
  // zoom distortion
  float len = length(dist);
  float d = u_zoomProgress > 0.0 ? pow(len, 0.5) * 0.8 : pow(len, 1.5) * 0.5;
  uv += u_zoomProgress * dist * d;

  // -------------------------
  // rgb shift
  vec4 tex = texture2D(u_texture, uv);
  float g = texture2D(u_texture, uv + u_mouseSpeed * 0.2).g;
  float b = texture2D(u_texture, uv + u_mouseSpeed * 0.4).b;
  tex = vec4(tex.r, g, b, tex.a);

  gl_FragColor = tex;
}