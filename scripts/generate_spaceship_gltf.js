import * as THREE from 'three';
import fs from 'fs';
import path from 'path';

// Polyfill FileReader for Node.js GLTFExporter
class PolyfillFileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      const base64 = Buffer.from(buf).toString('base64');
      this.result = 'data:' + (blob.type || 'application/octet-stream') + ';base64,' + base64;
      if (this.onloadend) this.onloadend();
    });
  }
}
global.FileReader = PolyfillFileReader;

async function buildSpaceshipGLB() {
  const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');

  const rootScene = new THREE.Scene();
  rootScene.name = 'Mothership_Vessel_Root';

  // =========================================================================
  // 1. PBR MATERIALS (Physical-Based Rendering with Metalness/Roughness/Emissive)
  // =========================================================================
  const matTitaniumArmor = new THREE.MeshStandardMaterial({
    name: 'Mat_Titanium_Armor',
    color: 0x222a36,
    metalness: 0.88,
    roughness: 0.28,
  });

  const matHullChassis = new THREE.MeshStandardMaterial({
    name: 'Mat_Hull_Chassis',
    color: 0x141b24,
    metalness: 0.82,
    roughness: 0.35,
  });

  const matPlateTrim = new THREE.MeshStandardMaterial({
    name: 'Mat_Plate_Trim',
    color: 0x334155,
    metalness: 0.92,
    roughness: 0.18,
  });

  // Emissive Neon Light Materials
  const matNeonCyan = new THREE.MeshStandardMaterial({
    name: 'Mat_Neon_Cyan',
    color: 0x00d2ff,
    emissive: 0x00f0ff,
    emissiveIntensity: 2.2,
    roughness: 0.15,
    metalness: 0.2,
  });

  const matNeonAmber = new THREE.MeshStandardMaterial({
    name: 'Mat_Neon_Amber',
    color: 0xff9900,
    emissive: 0xffaa00,
    emissiveIntensity: 2.2,
    roughness: 0.15,
    metalness: 0.2,
  });

  const matNeonGreen = new THREE.MeshStandardMaterial({
    name: 'Mat_Neon_Green',
    color: 0x10b981,
    emissive: 0x00ff88,
    emissiveIntensity: 2.0,
    roughness: 0.2,
    metalness: 0.1,
  });

  const matBrainTissue = new THREE.MeshStandardMaterial({
    name: 'Mat_Brain_Tissue',
    color: 0x93c5fd,
    emissive: 0x38bdf8,
    emissiveIntensity: 1.4,
    roughness: 0.3,
    metalness: 0.1,
  });

  const matGlassCanopy = new THREE.MeshStandardMaterial({
    name: 'Mat_Glass_Canopy',
    color: 0xa5f3fc,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.38,
  });

  const matGlassBiosphere = new THREE.MeshStandardMaterial({
    name: 'Mat_Glass_Biosphere',
    color: 0x86efac,
    metalness: 0.1,
    roughness: 0.08,
    transparent: true,
    opacity: 0.45,
  });

  const matFloraGreen = new THREE.MeshStandardMaterial({
    name: 'Mat_Flora_Green',
    color: 0x15803d,
    roughness: 0.65,
    metalness: 0.05,
  });

  const matWoodTrunk = new THREE.MeshStandardMaterial({
    name: 'Mat_Wood_Trunk',
    color: 0x5a3921,
    roughness: 0.85,
    metalness: 0.05,
  });

  const matPlasmaEngine = new THREE.MeshStandardMaterial({
    name: 'Mat_Plasma_Engine',
    color: 0x38bdf8,
    emissive: 0x00d2ff,
    emissiveIntensity: 3.5,
    roughness: 0.1,
    metalness: 0.5,
  });

  const matWindowWarmGlow = new THREE.MeshStandardMaterial({
    name: 'Mat_Window_Warm_Glow',
    color: 0xfde047,
    emissive: 0xf59e0b,
    emissiveIntensity: 1.8,
    roughness: 0.25,
  });

  // =========================================================================
  // 2. BOW SECTOR (PRUVA): COGNITIVE CORE, BRAIN & CANOPY
  // =========================================================================
  const bowGroup = new THREE.Group();
  bowGroup.name = 'Bow_Cognitive_Sector';

  // Aerodynamic nose under-chin armor
  const chinGeom = new THREE.CylinderGeometry(1.6, 0.4, 7, 32);
  chinGeom.rotateZ(Math.PI / 2);
  const chinMesh = new THREE.Mesh(chinGeom, matTitaniumArmor);
  chinMesh.position.set(-11.5, -0.4, 0);
  chinMesh.scale.set(1.1, 0.6, 0.9);
  bowGroup.add(chinMesh);

  // Upper aerodynamic prow frame collar
  const collarGeom = new THREE.TorusGeometry(2.3, 0.35, 16, 48, Math.PI);
  collarGeom.rotateY(Math.PI / 2);
  const collarMesh = new THREE.Mesh(collarGeom, matPlateTrim);
  collarMesh.position.set(-8.2, 1.2, 0);
  collarMesh.scale.set(1.0, 1.35, 1.15);
  bowGroup.add(collarMesh);

  // Aerodynamic Glass Canopy Dome
  const canopyGeom = new THREE.SphereGeometry(3.1, 48, 28, 0, Math.PI * 2, 0, Math.PI * 0.55);
  canopyGeom.scale(1.45, 0.85, 0.95);
  canopyGeom.rotateZ(Math.PI / 2);
  const canopyMesh = new THREE.Mesh(canopyGeom, matGlassCanopy);
  canopyMesh.position.set(-11.0, 1.2, 0);
  canopyMesh.name = 'Glass_Cockpit_Canopy';
  bowGroup.add(canopyMesh);

  // High-Fidelity Anatomical Cognitive Brain (Left & Right Hemispheres + Lobes)
  const brainGroup = new THREE.Group();
  brainGroup.name = 'Cognitive_Brain_Assembly';
  brainGroup.position.set(-11.0, 1.2, 0);

  function createBrainHemisphere(isLeft) {
    const hemiGroup = new THREE.Group();
    const zSign = isLeft ? 1 : -1;

    // Frontal Lobe
    const frontal = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 20), matBrainTissue);
    frontal.scale.set(1.2, 0.95, 0.8);
    frontal.position.set(-0.7, 0.2, zSign * 0.42);
    hemiGroup.add(frontal);

    // Parietal Lobe
    const parietal = new THREE.Mesh(new THREE.SphereGeometry(0.9, 24, 20), matBrainTissue);
    parietal.scale.set(1.0, 1.05, 0.82);
    parietal.position.set(0.2, 0.4, zSign * 0.44);
    hemiGroup.add(parietal);

    // Occipital Lobe
    const occipital = new THREE.Mesh(new THREE.SphereGeometry(0.72, 24, 20), matBrainTissue);
    occipital.scale.set(0.9, 0.85, 0.75);
    occipital.position.set(0.9, 0.05, zSign * 0.4);
    hemiGroup.add(occipital);

    // Temporal Lobe
    const temporal = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 20), matBrainTissue);
    temporal.scale.set(1.1, 0.75, 0.78);
    temporal.position.set(0.0, -0.35, zSign * 0.5);
    hemiGroup.add(temporal);

    // Convoluted Gyri/Sulci Wrinkle Ribbons
    for (let i = 0; i < 9; i++) {
      const curvePoints = [];
      const angleStart = (i / 9) * Math.PI * 1.8;
      for (let step = 0; step < 5; step++) {
        const u = angleStart + step * 0.35;
        const rx = Math.cos(u) * 0.8 + (Math.sin(step * 2) * 0.15);
        const ry = Math.sin(u) * 0.65 + (Math.cos(step * 3) * 0.12);
        const rz = (zSign * 0.7) + (Math.sin(step * 1.5) * 0.15);
        curvePoints.push(new THREE.Vector3(rx, ry + 0.1, rz));
      }
      const spline = new THREE.CatmullRomCurve3(curvePoints);
      const tubeGeom = new THREE.TubeGeometry(spline, 20, 0.065, 8, false);
      const wrinkle = new THREE.Mesh(tubeGeom, matBrainTissue);
      hemiGroup.add(wrinkle);
    }

    return hemiGroup;
  }

  const leftHemi = createBrainHemisphere(true);
  const rightHemi = createBrainHemisphere(false);
  brainGroup.add(leftHemi);
  brainGroup.add(rightHemi);

  // Brain Stem & Synapse Nucleus
  const stemGeom = new THREE.CylinderGeometry(0.25, 0.4, 1.2, 16);
  const brainStem = new THREE.Mesh(stemGeom, matBrainTissue);
  brainStem.position.set(0.5, -0.85, 0);
  brainStem.rotation.z = -0.35;
  brainGroup.add(brainStem);

  // Internal glowing synaptic core sphere
  const synapseCore = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), matNeonCyan);
  synapseCore.position.set(0, 0.1, 0);
  synapseCore.name = 'Synapse_Core_Light';
  brainGroup.add(synapseCore);

  bowGroup.add(brainGroup);
  rootScene.add(bowGroup);

  // =========================================================================
  // 3. NEON ENERGY CONDUITS (CYAN & AMBER & GREEN HIGHWAYS)
  // =========================================================================
  const conduitsGroup = new THREE.Group();
  conduitsGroup.name = 'Neon_Energy_Conduits';

  function createCurvedConduit(points, radius, material, name) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
    const geom = new THREE.TubeGeometry(curve, 48, radius, 12, false);
    const mesh = new THREE.Mesh(geom, material);
    mesh.name = name;
    return mesh;
  }

  // Cyan Brain Conduits flowing along upper hull
  conduitsGroup.add(createCurvedConduit([
    [-9.5, 1.4, 0.9],
    [-7.5, 1.9, 1.4],
    [-4.0, 2.1, 1.6],
    [0.0, 2.3, 1.5],
    [3.5, 2.0, 1.2],
    [5.5, 1.6, 0.8]
  ], 0.11, matNeonCyan, 'Cyan_Upper_Conduit_Starboard'));

  conduitsGroup.add(createCurvedConduit([
    [-9.5, 1.4, -0.9],
    [-7.5, 1.9, -1.4],
    [-4.0, 2.1, -1.6],
    [0.0, 2.3, -1.5],
    [3.5, 2.0, -1.2],
    [5.5, 1.6, -0.8]
  ], 0.11, matNeonCyan, 'Cyan_Upper_Conduit_Port'));

  // Amber Power Conduits snaking into midsection engineering
  conduitsGroup.add(createCurvedConduit([
    [-10.0, 0.8, 0.8],
    [-8.0, 0.6, 1.3],
    [-5.0, 0.4, 1.8],
    [-2.0, 0.2, 1.9],
    [1.0, 0.5, 1.7],
    [3.0, 0.8, 1.4]
  ], 0.12, matNeonAmber, 'Amber_Mid_Conduit_Starboard'));

  conduitsGroup.add(createCurvedConduit([
    [-10.0, 0.8, -0.8],
    [-8.0, 0.6, -1.3],
    [-5.0, 0.4, -1.8],
    [-2.0, 0.2, -1.9],
    [1.0, 0.5, -1.7],
    [3.0, 0.8, -1.4]
  ], 0.12, matNeonAmber, 'Amber_Mid_Conduit_Port'));

  // Emerald Bio-Conduits feeding the stern arboretum
  conduitsGroup.add(createCurvedConduit([
    [2.0, -0.4, 1.2],
    [5.0, -0.2, 1.4],
    [8.0, 0.3, 1.3],
    [11.0, 0.7, 1.0],
    [12.8, 0.9, 0.4]
  ], 0.10, matNeonGreen, 'Green_Bio_Conduit_Starboard'));

  conduitsGroup.add(createCurvedConduit([
    [2.0, -0.4, -1.2],
    [5.0, -0.2, -1.4],
    [8.0, 0.3, -1.3],
    [11.0, 0.7, -1.0],
    [12.8, 0.9, -0.4]
  ], 0.10, matNeonGreen, 'Green_Bio_Conduit_Port'));

  rootScene.add(conduitsGroup);

  // =========================================================================
  // 4. MIDSECTION: STREAMLINED ARMOR SPINE & OBSERVATION WINGS
  // =========================================================================
  const midGroup = new THREE.Group();
  midGroup.name = 'Midsection_Hull_Sector';

  // Upper Main Armor Spine (Aerodynamic faceted extrusion)
  const spineGeom = new THREE.BoxGeometry(14, 1.8, 3.4);
  const spineMesh = new THREE.Mesh(spineGeom, matTitaniumArmor);
  spineMesh.position.set(-1.0, 2.2, 0);
  midGroup.add(spineMesh);

  // Dorsal Radiator Heat-sink Fin Ribs
  for (let i = 0; i < 8; i++) {
    const finGeom = new THREE.BoxGeometry(0.3, 0.5, 2.8);
    const finMesh = new THREE.Mesh(finGeom, matPlateTrim);
    finMesh.position.set(-5.0 + i * 1.3, 3.2, 0);
    midGroup.add(finMesh);
  }

  // Dorsal Bridge Tower (Command deck with visor window)
  const bridgeTower = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.9, 1.8), matPlateTrim);
  bridgeTower.position.set(1.5, 3.4, 0);
  midGroup.add(bridgeTower);

  const bridgeVisor = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.25, 1.85), matNeonCyan);
  bridgeVisor.position.set(1.5, 3.45, 0);
  midGroup.add(bridgeVisor);

  // Sensor Antenna Mast
  const mastGeom = new THREE.CylinderGeometry(0.06, 0.12, 1.6, 12);
  const commsMast = new THREE.Mesh(mastGeom, matPlateTrim);
  commsMast.position.set(2.5, 4.4, 0);
  midGroup.add(commsMast);

  // Main Keel Underchassis (Tapered bottom fuselage)
  const keelGeom = new THREE.CylinderGeometry(1.8, 2.4, 16, 24);
  keelGeom.rotateZ(Math.PI / 2);
  const keelMesh = new THREE.Mesh(keelGeom, matHullChassis);
  keelMesh.position.set(-0.5, -0.6, 0);
  keelMesh.scale.set(1.0, 0.7, 0.85);
  midGroup.add(keelMesh);

  // Port and Starboard Lateral Armor Wings / Skirts
  function createArmorSkirts(isStarboard) {
    const zSign = isStarboard ? 1 : -1;
    const skirtGroup = new THREE.Group();

    // Upper beveled armor slab
    const slabGeom = new THREE.BoxGeometry(12, 1.2, 0.6);
    const slabMesh = new THREE.Mesh(slabGeom, matTitaniumArmor);
    slabMesh.position.set(-0.5, 1.3, zSign * 2.1);
    slabMesh.rotation.x = zSign * 0.18;
    skirtGroup.add(slabMesh);

    // Mid-level observation window strip (Glowing warm interior lights)
    const windowStripGeom = new THREE.BoxGeometry(9.5, 0.55, 0.1);
    const windowStrip = new THREE.Mesh(windowStripGeom, matWindowWarmGlow);
    windowStrip.position.set(0.0, 0.5, zSign * 2.3);
    skirtGroup.add(windowStrip);

    // Lower armor hull skirt
    const lowerSkirtGeom = new THREE.BoxGeometry(11, 1.0, 0.5);
    const lowerSkirt = new THREE.Mesh(lowerSkirtGeom, matHullChassis);
    lowerSkirt.position.set(-0.2, -0.4, zSign * 2.0);
    lowerSkirt.rotation.x = -zSign * 0.22;
    skirtGroup.add(lowerSkirt);

    return skirtGroup;
  }

  midGroup.add(createArmorSkirts(true));
  midGroup.add(createArmorSkirts(false));

  // Escort Scout Shuttle (cruising alongside beneath port side)
  const shuttleGroup = new THREE.Group();
  shuttleGroup.name = 'Escort_Scout_Shuttle';
  shuttleGroup.position.set(-4.5, -2.4, -3.2);

  const shuttleBody = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.2, 16), matTitaniumArmor);
  shuttleBody.rotation.z = Math.PI / 2;
  shuttleGroup.add(shuttleBody);

  const shuttleWings = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 1.8), matPlateTrim);
  shuttleWings.position.set(-0.2, 0, 0);
  shuttleGroup.add(shuttleWings);

  const shuttleThruster = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.4, 16), matPlasmaEngine);
  shuttleThruster.rotation.z = Math.PI / 2;
  shuttleThruster.position.set(-1.2, 0, 0);
  shuttleGroup.add(shuttleThruster);

  midGroup.add(shuttleGroup);
  rootScene.add(midGroup);

  // =========================================================================
  // 5. STERN SECTOR (PUPA): ARBORETUM BIOSPHERE, CANOPY & ION ENGINES
  // =========================================================================
  const sternGroup = new THREE.Group();
  sternGroup.name = 'Stern_Arboretum_Sector';

  // Arboretum Base Deck Cradle
  const deckCradle = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 2.8, 1.2, 32), matTitaniumArmor);
  deckCradle.position.set(10.0, 0.6, 0);
  deckCradle.scale.set(1.4, 0.8, 1.0);
  sternGroup.add(deckCradle);

  // Terraced Grass Garden Ground
  const grassBed = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.25, 32), matFloraGreen);
  grassBed.position.set(10.0, 1.15, 0);
  grassBed.scale.set(1.35, 1.0, 0.95);
  sternGroup.add(grassBed);

  // Secondary Geodesic Glass Sphere (Lower biosphere)
  const innerSphereGeom = new THREE.SphereGeometry(1.6, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.65);
  const innerSphere = new THREE.Mesh(innerSphereGeom, matGlassBiosphere);
  innerSphere.position.set(12.5, 1.2, 0);
  innerSphere.scale.set(1.0, 1.1, 1.0);
  sternGroup.add(innerSphere);

  // 4 Sweeping Architectural Pylons holding the upper umbrella canopy
  const pylonPositions = [
    [7.5, 1.0, 1.4, 0.35, 0.2],
    [7.5, 1.0, -1.4, 0.35, -0.2],
    [12.5, 1.0, 1.4, -0.35, 0.2],
    [12.5, 1.0, -1.4, -0.35, -0.2]
  ];

  pylonPositions.forEach(([px, py, pz, rotZ, rotX], idx) => {
    const pylonGeom = new THREE.CylinderGeometry(0.18, 0.28, 3.2, 16);
    const pylon = new THREE.Mesh(pylonGeom, matPlateTrim);
    pylon.position.set(px, py + 1.4, pz);
    pylon.rotation.z = rotZ;
    pylon.rotation.x = rotX;
    pylon.name = `Arboretum_Pylon_${idx + 1}`;
    sternGroup.add(pylon);
  });

  // Grand Arboretum Parasol Glass Canopy Dome
  const canopyDishGeom = new THREE.SphereGeometry(3.8, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.38);
  const canopyDish = new THREE.Mesh(canopyDishGeom, matGlassBiosphere);
  canopyDish.position.set(10.0, 3.2, 0);
  canopyDish.scale.set(1.35, 0.65, 1.1);
  canopyDish.name = 'Grand_Parasol_Canopy';
  sternGroup.add(canopyDish);

  // Canopy Structural Rim Collar
  const rimGeom = new THREE.TorusGeometry(3.8, 0.16, 16, 48);
  rimGeom.rotateX(Math.PI / 2);
  const rimMesh = new THREE.Mesh(rimGeom, matPlateTrim);
  rimMesh.position.set(10.0, 3.2, 0);
  rimMesh.scale.set(1.35, 1.1, 0.65);
  sternGroup.add(rimMesh);

  // Sculpted Trees and Living Flora inside Arboretum
  const treeLocations = [
    [8.5, 1.2, 0.6, 1.1],
    [9.4, 1.2, -0.7, 1.3],
    [10.2, 1.2, 0.8, 1.0],
    [11.0, 1.2, -0.5, 1.2],
    [11.8, 1.2, 0.4, 0.9],
    [8.8, 1.2, -0.3, 0.85]
  ];

  treeLocations.forEach(([tx, ty, tz, scale], idx) => {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(tx, ty, tz);
    treeGroup.scale.setScalar(scale);

    // Trunk
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.8, 8), matWoodTrunk);
    trunk.position.y = 0.4;
    treeGroup.add(trunk);

    // Foliage Canopy Cluster
    const crown1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48, 1), matFloraGreen);
    crown1.position.y = 0.85;
    treeGroup.add(crown1);

    const crown2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.36, 1), matFloraGreen);
    crown2.position.set(0.12, 1.1, 0.08);
    treeGroup.add(crown2);

    sternGroup.add(treeGroup);
  });

  // Twin Heavy Sublight Ion Engines
  function createIonThruster(isStarboard) {
    const zSign = isStarboard ? 1 : -1;
    const thrusterGroup = new THREE.Group();
    thrusterGroup.position.set(15.2, 0.5, zSign * 1.5);

    // Cowling ring
    const cowl = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.2, 2.4, 28), matTitaniumArmor);
    cowl.rotation.z = Math.PI / 2;
    thrusterGroup.add(cowl);

    // Inner glowing turbine emitter
    const turbine = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.3, 24), matPlasmaEngine);
    turbine.rotation.z = Math.PI / 2;
    turbine.position.x = 0.9;
    thrusterGroup.add(turbine);

    // Plasma Exhaust Cone Trail
    const exhaustCone = new THREE.Mesh(new THREE.ConeGeometry(0.85, 3.2, 24), matPlasmaEngine);
    exhaustCone.rotation.z = -Math.PI / 2;
    exhaustCone.position.x = 2.4;
    thrusterGroup.add(exhaustCone);

    return thrusterGroup;
  }

  sternGroup.add(createIonThruster(true));
  sternGroup.add(createIonThruster(false));

  rootScene.add(sternGroup);

  // =========================================================================
  // 6. EXPORT SCENE TO GLB (BINARY GLTF)
  // =========================================================================
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      rootScene,
      (gltf) => {
        const outDir = path.resolve(process.cwd(), 'public/models');
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }
        const filePath = path.join(outDir, 'spaceship_hull.glb');
        fs.writeFileSync(filePath, Buffer.from(gltf));
        console.log(`GLB exported successfully to: ${filePath} (${gltf.byteLength} bytes)`);
        resolve(filePath);
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

buildSpaceshipGLB()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to generate spaceship GLB:', err);
    process.exit(1);
  });
