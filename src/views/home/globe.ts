import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { ports } from "./content";

/** Latitude/longitude to a point on a sphere of radius r (three.js: y up, z toward the camera at lon 0). */
function toVec(lat: number, lon: number, r = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const cssColor = (name: string) => new Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "white");

/**
 * The home page's one Three.js moment: a hairline globe turned to face India and the Gulf, with the HYD ↔ RAK route
 * drawn as a lifted arc. Colours are read from the CSS tokens. Returns a cleanup function.
 */
export function mountGlobe(host: HTMLElement, { animate }: { animate: boolean }): () => void {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.domElement.setAttribute("aria-hidden", "true");
  Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%" });
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 2.35);

  const ink = cssColor("--on-ink");
  const gold = cssColor("--accent");
  const globe = new Group();

  // Graticule: parallels every 15°, meridians every 15°.
  const pts: number[] = [];
  for (let lat = -75; lat <= 75; lat += 15)
    for (let lon = -180; lon < 180; lon += 3) {
      const p1 = toVec(lat, lon);
      const p2 = toVec(lat, lon + 3);
      pts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  for (let lon = -180; lon < 180; lon += 15)
    for (let lat = -90; lat < 90; lat += 3) {
      const p1 = toVec(lat, lon);
      const p2 = toVec(lat + 3, lon);
      pts.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
    }
  const grid = new BufferGeometry();
  grid.setAttribute("position", new Float32BufferAttribute(pts, 3));
  globe.add(new LineSegments(grid, new LineBasicMaterial({ color: ink, transparent: true, opacity: 0.14 })));

  // Occluder so the far side of the graticule doesn't show through.
  globe.add(new Mesh(new SphereGeometry(0.995, 48, 48), new MeshBasicMaterial({ color: cssColor("--ink") })));

  const dot = (lat: number, lon: number, size: number, color: Color) => {
    const m = new Mesh(new SphereGeometry(size, 16, 16), new MeshBasicMaterial({ color }));
    m.position.copy(toVec(lat, lon, 1.002));
    globe.add(m);
  };
  ports.cities.forEach((c) => dot(c.lat, c.lon, 0.008, ink));
  dot(ports.from.lat, ports.from.lon, 0.016, gold);
  dot(ports.to.lat, ports.to.lon, 0.016, gold);

  const a = toVec(ports.to.lat, ports.to.lon);
  const b = toVec(ports.from.lat, ports.from.lon);
  const mid = a.clone().add(b).normalize().multiplyScalar(1.22);
  const curve = new CatmullRomCurve3([a, a.clone().lerp(mid, 0.6).normalize().multiplyScalar(1.14), mid, b.clone().lerp(mid, 0.6).normalize().multiplyScalar(1.14), b]);
  const arc = new BufferGeometry().setFromPoints(curve.getPoints(96));
  const arcLine = new Line(arc, new LineBasicMaterial({ color: gold }));
  globe.add(arcLine);

  // Turn the globe so the route's midpoint (about 21°N, 67°E) faces the camera: yaw it onto the y–z plane, then tilt by its latitude.
  const focus = toVec(21.5, 67);
  globe.rotation.y = -Math.atan2(focus.x, focus.z);
  globe.rotation.x = (21.5 * Math.PI) / 180;
  scene.add(globe);

  let frame = 0;
  let raf = 0;
  const base = globe.rotation.y;
  const draw = () => {
    frame += 1;
    arc.setDrawRange(0, Math.min(97, Math.floor(frame * 2)));
    globe.rotation.y = base + Math.sin(frame / 300) * 0.05;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(draw);
  };
  if (animate) draw();
  else renderer.render(scene, camera);

  const onResize = () => {
    renderer.setSize(host.clientWidth, host.clientHeight);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    if (!animate) renderer.render(scene, camera);
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    scene.traverse((o) => {
      const m = o as Mesh;
      m.geometry?.dispose();
      const mat = m.material as MeshBasicMaterial | MeshBasicMaterial[] | undefined;
      (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((x) => x.dispose());
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
}
