/**
 * MIET E-Cell — Three.js 3D Hero Scene
 * Interactive 3D background with floating geometry, glowing particles,
 * and real-time mouse-parallax for a premium spatial feel.
 */

(function () {
  'use strict';

  // ─── Scene Setup ──────────────────────────────────────────────────────────
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const isMobile = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: !isMobile, 
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 18);

  // ─── Lighting ─────────────────────────────────────────────────────────────
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const redLight = new THREE.PointLight(0xe8001d, 6, 40);
  redLight.position.set(5, 8, 5);
  scene.add(redLight);

  const blueLight = new THREE.PointLight(0xff6b6b, 3, 30);
  blueLight.position.set(-8, -5, 3);
  scene.add(blueLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
  rimLight.position.set(0, 10, -10);
  scene.add(rimLight);

  // ─── Floating Geometry ────────────────────────────────────────────────────
  const meshes = [];

  // Materials
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xe8001d,
    metalness: 0.8,
    roughness: 0.1,
    emissive: 0x330007,
    emissiveIntensity: 0.5,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 1.5,
    opacity: 0.15,
    transparent: true,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0xff3b3b,
    metalness: 0.9,
    roughness: 0.05,
    emissive: 0x660010,
    emissiveIntensity: 0.4,
  });

  // Helper: random in range
  const rnd = (min, max) => Math.random() * (max - min) + min;

  // Create floating objects
  const shapes = isMobile ? [
    { geo: new THREE.IcosahedronGeometry(1.2, 0), mat: wireMat, pos: [2, 3, -5], rot: [0.5, 0.3, 0] },
    { geo: new THREE.OctahedronGeometry(0.8, 0), mat: accentMat, pos: [-3, -4, -4], rot: [0.2, 0.8, 0.1] },
    { geo: new THREE.TetrahedronGeometry(0.7, 0), mat: wireMat, pos: [4, -5, -6], rot: [0.1, 0.5, 0.3] },
    { geo: new THREE.IcosahedronGeometry(0.5, 0), mat: wireMat, pos: [-2, 5, -8], rot: [0.9, 0.1, 0.6] },
  ] : [
    { geo: new THREE.IcosahedronGeometry(1.8, 0), mat: wireMat, pos: [4, 2, -3], rot: [0.5, 0.3, 0] },
    { geo: new THREE.OctahedronGeometry(1.2, 0), mat: accentMat, pos: [-5, 3, -2], rot: [0.2, 0.8, 0.1] },
    { geo: new THREE.TetrahedronGeometry(1.0, 0), mat: wireMat, pos: [6, -3, -5], rot: [0.1, 0.5, 0.3] },
    { geo: new THREE.IcosahedronGeometry(0.8, 1), mat: glassMat, pos: [-4, -2, -1], rot: [0.7, 0.2, 0.4] },
    { geo: new THREE.OctahedronGeometry(0.6, 0), mat: accentMat, pos: [2, 5, -6], rot: [0.4, 0.6, 0.2] },
    { geo: new THREE.BoxGeometry(1.2, 1.2, 1.2), mat: glassMat, pos: [-7, 0, -4], rot: [0.3, 0.4, 0.5] },
    { geo: new THREE.IcosahedronGeometry(0.5, 0), mat: wireMat, pos: [0, -5, -2], rot: [0.9, 0.1, 0.6] },
    { geo: new THREE.TetrahedronGeometry(0.7, 0), mat: accentMat, pos: [-2, 6, -8], rot: [0.2, 0.7, 0.3] },
  ];

  shapes.forEach(({ geo, mat, pos, rot }) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(...rot);
    // Store random spin speeds
    mesh.userData.spinX = rnd(-0.003, 0.003);
    mesh.userData.spinY = rnd(-0.005, 0.005);
    mesh.userData.floatSpeed = rnd(0.4, 1.2);
    mesh.userData.floatAmp = rnd(0.08, 0.2);
    mesh.userData.floatOffset = rnd(0, Math.PI * 2);
    mesh.userData.baseY = pos[1];
    scene.add(mesh);
    meshes.push(mesh);

    // Add wireframe overlay for depth
    const wireGeo = geo.clone();
    const wireLine = new THREE.Mesh(wireGeo, new THREE.MeshBasicMaterial({
      color: 0xe8001d,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    }));
    wireLine.position.set(...pos);
    wireLine.rotation.set(...rot);
    wireLine.userData.isMirror = true;
    wireLine.userData.mirrorOf = mesh;
    scene.add(wireLine);
    meshes.push(wireLine);
  });

  // ─── Particle Field ────────────────────────────────────────────────────────
  const PARTICLE_COUNT = isMobile ? 80 : 300;
  const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  const particleSizes = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particlePositions[i * 3]     = rnd(-20, 20);
    particlePositions[i * 3 + 1] = rnd(-20, 20);
    particlePositions[i * 3 + 2] = rnd(-15, 5);
    particleSizes[i] = rnd(0.5, 2.5);
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0xe8001d,
    size: 0.08,
    sizeAttenuation: true,
    transparent: true,
    opacity: isMobile ? 0.3 : 0.6,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ─── Connection Lines (Network) ───────────────────────────────────────────
  const linePositions = [];
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xe8001d,
    transparent: true,
    opacity: isMobile ? 0.03 : 0.06,
  });

  // Random connecting lines
  const LINE_COUNT = isMobile ? 8 : 20;
  for (let i = 0; i < LINE_COUNT; i++) {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(rnd(-15, 15), rnd(-12, 12), rnd(-10, 0)),
      new THREE.Vector3(rnd(-15, 15), rnd(-12, 12), rnd(-10, 0)),
    ]);
    const line = new THREE.Line(lineGeo, lineMat);
    scene.add(line);
    linePositions.push(line);
  }

  // ─── Mouse Parallax ───────────────────────────────────────────────────────
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  document.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ─── Resize Handler ───────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─── Animation Loop ───────────────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Camera gentle parallax
    camera.position.x = mouse.x * 1.5;
    camera.position.y = mouse.y * 1.0;
    camera.lookAt(0, 0, 0);

    // Animate meshes
    meshes.forEach(mesh => {
      if (mesh.userData.isMirror) {
        // Mirror solid mesh exactly
        const origin = mesh.userData.mirrorOf;
        mesh.position.copy(origin.position);
        mesh.rotation.copy(origin.rotation);
        return;
      }
      mesh.rotation.x += mesh.userData.spinX;
      mesh.rotation.y += mesh.userData.spinY;
      mesh.position.y = mesh.userData.baseY +
        Math.sin(elapsed * mesh.userData.floatSpeed + mesh.userData.floatOffset) * mesh.userData.floatAmp;
    });

    // Slowly rotate particle cloud
    particles.rotation.y = elapsed * 0.03;
    particles.rotation.x = Math.sin(elapsed * 0.02) * 0.1;

    // Pulsing red light
    redLight.intensity = 5 + Math.sin(elapsed * 1.5) * 2;
    redLight.position.x = Math.sin(elapsed * 0.4) * 8;
    redLight.position.y = Math.cos(elapsed * 0.3) * 6;

    renderer.render(scene, camera);
  }

  animate();
})();
