import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Link } from "react-router-dom";

function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uColorA: { value: new THREE.Color("#f6cf8c") },
      uColorB: { value: new THREE.Color("#d77a2a") },
      uColorC: { value: new THREE.Color("#1a1614") },
    };

    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uScroll;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying float vDispl;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vNormal = normal;
        vec3 pos = position;
        float t = uTime * 0.35;
        float n = snoise(pos * 0.9 + vec3(t, t*0.7, -t*0.5));
        float n2 = snoise(pos * 2.4 + vec3(-t*0.6, t*0.4, t*0.8)) * 0.5;
        float displ = (n + n2) * 0.35;
        float mDist = distance(pos.xy, uMouse * 1.6);
        displ += smoothstep(2.0, 0.0, mDist) * 0.18;
        displ += uScroll * 0.4 * sin(pos.y * 8.0 + uTime);
        vDispl = displ;
        vec3 newPos = pos + normal * displ;
        vPos = newPos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying float vDispl;

      void main() {
        vec3 viewDir = normalize(cameraPosition - vPos);
        float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 2.5);
        float intensity = clamp(vDispl * 1.6 + 0.5, 0.0, 1.0);
        vec3 col = mix(uColorC, uColorB, intensity);
        col = mix(col, uColorA, fresnel * 0.9);
        col += uColorA * fresnel * 0.4;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: false });
    const geometry = new THREE.IcosahedronGeometry(1.0, 64);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 1.7;
    scene.add(mesh);

    const wireGeo = new THREE.IcosahedronGeometry(1.4, 4);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xd97757, wireframe: true, transparent: true, opacity: 0.08 });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    wire.position.x = 1.7;
    scene.add(wire);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    let scrollT = 0;
    const onScroll = () => { scrollT = Math.min(window.scrollY / window.innerHeight, 1.2); };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf;
    const tick = () => {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();
      mouse.lerp(targetMouse, 0.06);
      uniforms.uTime.value = t;
      uniforms.uMouse.value.copy(mouse);
      uniforms.uScroll.value = scrollT;
      mesh.rotation.y += dt * 0.18;
      mesh.rotation.x = Math.sin(t * 0.3) * 0.15;
      wire.rotation.y -= dt * 0.06;
      wire.rotation.x = Math.cos(t * 0.2) * 0.2;
      const s = Math.max(0.5, 1 - scrollT * 0.5);
      mesh.scale.setScalar(s);
      wire.scale.setScalar(s);
      const baseX = window.innerWidth < 768 ? 0.7 : 1.7;
      mesh.position.x = baseX + scrollT * 1.5;
      wire.position.x = baseX + scrollT * 1.5;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero__canvas" aria-hidden="true" />;
}

export default function Hero() {
  const heroRef = useRef(null);
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => heroRef.current?.classList.add("ready"));
    });
  }, []);
  return (
    <section className="hero" ref={heroRef} data-screen-label="01 Hero">
      <HeroCanvas />
      <div className="hero__veil" />



      <div className="hero__cards">
        <div className="float-card fc-1">
          <div className="label">AGENTS ONLINE</div>
          <div className="value">20 <span className="accent">↑ 12</span></div>
        </div>
        <div className="float-card fc-2">
          <div className="label">THROUGHPUT GAIN</div>
          <div className="value">11.4<span className="accent">×</span></div>
        </div>
        <div className="float-card fc-3">
          <div className="label">UPTIME · 30D</div>
          <div className="value">99.98<span className="accent">%</span></div>
        </div>
      </div>

      <div className="hero__inner">
        <div className="hero__eyebrow">
          <span className="badge">NEW</span>
          <span>Agentic systems / Cohort '26 — 3 seats remain</span>
        </div>

        <h1 className="hero__title">
          <span className="line"><span>Operate at the</span></span>
          <span className="line"><span>speed of</span></span>
          <span className="line"><span className="serif">intelligence.</span></span>
        </h1>

        <p className="hero__sub">
          Velyx Labs partners with ambitious founders to build agentic systems, AI-native SaaS, and
          MVPs that compound — so your company scales in revenue, not headcount. We engineer the
          leverage that turns a small team into a category leader.
        </p>

        <div className="hero__actions">
          <Link to="/contact" className="btn btn--primary">
            Book a strategy call
            <span className="arr">↗</span>
          </Link>
          <Link to="/portfolio" className="btn btn--ghost">
            See the work
            <span className="arr">→</span>
          </Link>
        </div>
      </div>

      <div className="hero__pin">
        <span>SCROLL</span>
        <span className="arrow-down">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" /></svg>
        </span>
      </div>

      <div className="hero__ticker">
        <div className="stat"><span className="live" /> <span>LIVE · 20 AGENTS DEPLOYED</span></div>
        <div className="stat"><span>SHIPPED <strong>100</strong> SYSTEMS</span></div>
        <div className="stat"><span>AVG. <strong>11.4×</strong> THROUGHPUT GAIN</span></div>
        <div className="stat"><span>BLR / SF / REMOTE</span></div>
        <div className="stat"><span>v2.6.0 · MAY '26</span></div>
      </div>
    </section>
  );
}
