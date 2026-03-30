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
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

  // ─── Particle Field & Celestial Starfield ──────────────────────────────────
  const starGeo = new THREE.BufferGeometry();
  const starCount = isMobile ? 500 : 2000;
  const starPositions = new Float32Array(starCount * 3);
  const starVelocities = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3]     = rnd(-60, 60);
    starPositions[i * 3 + 1] = rnd(-40, 40);
    starPositions[i * 3 + 2] = rnd(-80, 10);
    starVelocities[i] = rnd(0.01, 0.04);
  }
  
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: isMobile ? 0.05 : 0.08,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true
  });

  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // Red Accents (The Nebula Core)
  const coreCount = isMobile ? 100 : 400;
  const corePositions = new Float32Array(coreCount * 3);
  for (let i = 0; i < coreCount; i++) {
    corePositions[i * 3]     = rnd(-30, 30);
    corePositions[i * 3 + 1] = rnd(-20, 20);
    corePositions[i * 3 + 2] = rnd(-30, 5);
  }
  const coreGeo = new THREE.BufferGeometry();
  coreGeo.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
  const coreMat = new THREE.PointsMaterial({
    color: 0xe8001d,
    size: 0.12,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const coreField = new THREE.Points(coreGeo, coreMat);
  scene.add(coreField);

  // Connection Lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0xe8001d, transparent: true, opacity: 0.05 });

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

    // Animate meshes with interactivity
    meshes.forEach(mesh => {
      if (mesh.userData.isMirror) {
        const origin = mesh.userData.mirrorOf;
        mesh.position.copy(origin.position);
        mesh.rotation.copy(origin.rotation);
        return;
      }

      // Base rotation
      mesh.rotation.x += mesh.userData.spinX + (mouse.targetX * 0.01);
      mesh.rotation.y += mesh.userData.spinY + (mouse.targetY * 0.01);

      // Mouse "Push" effect
      // Distance from mouse to mesh in 2D space (using camera projection logic or simplified screen space)
      const dx = mouse.x * 10 - mesh.position.x;
      const dy = mouse.y * 10 - mesh.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const pushForce = Math.max(0, 5 - dist) * 0.15;
      mesh.position.x -= (dx / dist) * pushForce;
      mesh.position.y -= (dy / dist) * pushForce;

      // Base floating
      const floatY = mesh.userData.baseY +
        Math.sin(elapsed * mesh.userData.floatSpeed + mesh.userData.floatOffset) * mesh.userData.floatAmp;
      
      // Smoothly blend the pushed position back toward the floating base position
      mesh.position.y += (floatY - mesh.position.y) * 0.05;
      mesh.position.z += (rnd(-0.02, 0.02)); // Subtle jitter for depth
    });

    // Hyperspace scroll logic
    const scrollDelta = window.scrollY - (window.lastScrollY || 0);
    window.lastScrollY = window.scrollY;
    const hyperspaceSpeed = Math.abs(scrollDelta) * 0.04;

    // Drifting starfield with scroll "warp"
    if (typeof starField !== 'undefined') {
      const positions = starField.geometry.attributes.position.array;
      for (let i = 0; i < starCount; i++) {
        // Move star forward (scroll warp speed + base drift)
        positions[i * 3 + 2] += starVelocities[i] + hyperspaceSpeed;
        
        // Wrap stars back to distance if they get too close
        if (positions[i * 3 + 2] > 20) {
          positions[i * 3 + 2] = -80;
        }
      }
      starField.geometry.attributes.position.needsUpdate = true;
      starField.rotation.y += 0.0005;
    }

    if (typeof coreField !== 'undefined') {
      coreField.rotation.y = -elapsed * 0.015;
      coreField.rotation.z = Math.cos(elapsed * 0.01) * 0.08;
    }

    // Pulsing nebula lights
    redLight.intensity = 4 + Math.sin(elapsed * 0.8) * 2;
    redLight.position.x = Math.sin(elapsed * 0.4) * 10;
    redLight.position.y = Math.cos(elapsed * 0.3) * 8;

    renderer.render(scene, camera);
  }

  animate();
})();
