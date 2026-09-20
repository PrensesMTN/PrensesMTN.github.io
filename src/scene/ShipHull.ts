import * as THREE from 'three';
import { RenderMode } from '../types';

export class ShipHull {
  public group: THREE.Group;
  public realisticGroup: THREE.Group;
  public blueprintGroup: THREE.Group;

  // Animated elements
  private brainGlowLight!: THREE.PointLight;
  private neuralSparks: THREE.Points[] = [];
  private animatedPulseElements: Array<(time: number) => void> = [];
  private escortShuttle!: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'MothershipNeuroVessel';

    this.realisticGroup = new THREE.Group();
    this.blueprintGroup = new THREE.Group();

    this.group.add(this.realisticGroup);
    this.group.add(this.blueprintGroup);

    // Initial mode is blueprint
    this.realisticGroup.visible = false;
    this.blueprintGroup.visible = true;

    this.buildSpaceship();
  }

  private buildSpaceship() {
    // -----------------------------------------------------------
    // MATERIALS
    // -----------------------------------------------------------
    // Realistic Starship Hull Materials (Light titanium alloy with chamfered seams)
    const hullMatPrimary = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc, // Elegant off-white / light slate titanium
      roughness: 0.35,
      metalness: 0.75,
      side: THREE.DoubleSide
    });

    const hullMatSecondary = new THREE.MeshStandardMaterial({
      color: 0x475569, // Darker armor plates / structural ribs
      roughness: 0.45,
      metalness: 0.85
    });

    const hullMatDarkChassis = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.9
    });

    // Glowing Neon Materials
    const blueNeuralMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: false
    });

    const orangeNeuralMat = new THREE.MeshBasicMaterial({
      color: 0xff8c00,
      wireframe: false
    });

    const greenBioMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: false
    });

    // Transparent Glass Canopy Materials
    const glassBrainCanopyMat = new THREE.MeshPhysicalMaterial({
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.42,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.85,
      ior: 1.4,
      side: THREE.DoubleSide
    });

    const glassBioDomeMat = new THREE.MeshPhysicalMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.4,
      side: THREE.DoubleSide
    });

    // Blueprint Material
    const blueprintLineMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });

    // -----------------------------------------------------------
    // 1. MAIN ELONGATED FUSELAGE / ARMOR SHELL
    // -----------------------------------------------------------
    this.createMainFuselage(hullMatPrimary, hullMatSecondary, hullMatDarkChassis, blueprintLineMat);

    // -----------------------------------------------------------
    // 2. FRONT COCKPIT: GLOWING 3D BRAIN & GLASS CANOPY
    // -----------------------------------------------------------
    this.createBrainCanopySection(glassBrainCanopyMat, blueprintLineMat);

    // -----------------------------------------------------------
    // 3. GLOWING NEURAL & ENERGY CONDUIT PIPELINES
    // -----------------------------------------------------------
    this.createNeuralConduits(blueNeuralMat, orangeNeuralMat, greenBioMat, blueprintLineMat);

    // -----------------------------------------------------------
    // 4. CUTAWAY OBSERVATION DECK & WINDOWS (MIDSECTION)
    // -----------------------------------------------------------
    this.createObservationCutaways(hullMatDarkChassis, blueprintLineMat);

    // -----------------------------------------------------------
    // 5. REAR ARBORETUM, BIOSPHERE & BOTANICAL DOMES
    // -----------------------------------------------------------
    this.createArboretumBiosphere(glassBioDomeMat, hullMatPrimary, blueprintLineMat);

    // -----------------------------------------------------------
    // 6. TOP BRIDGE TOWER, MASTS & SENSOR ARRAY
    // -----------------------------------------------------------
    this.createSuperstructure(hullMatPrimary, hullMatSecondary, blueprintLineMat);

    // -----------------------------------------------------------
    // 7. STERN THRUSTERS & REAR ENGINE NACELLES
    // -----------------------------------------------------------
    this.createSternEngines(hullMatDarkChassis, blueprintLineMat);

    // -----------------------------------------------------------
    // 8. ESCORT SCOUT SHUTTLE (FLYING ALONGSIDE)
    // -----------------------------------------------------------
    this.createEscortShuttle(hullMatPrimary, blueprintLineMat);
  }

  /**
   * 1. Main Fuselage Structure matching the reference profile
   */
  private createMainFuselage(
    hullMat: THREE.Material,
    secMat: THREE.Material,
    darkMat: THREE.Material,
    bpMat: THREE.Material
  ) {
    const fuselageGroup = new THREE.Group();

    // Elongated central keel & lower spine
    const spineGeom = new THREE.BoxGeometry(26, 1.8, 6.5);
    const spineMesh = new THREE.Mesh(spineGeom, hullMat);
    spineMesh.position.set(0.5, 0.2, 0);
    spineMesh.castShadow = true;
    spineMesh.receiveShadow = true;
    fuselageGroup.add(spineMesh);

    // Stepped upper armor plating
    const upperDeckGeom = new THREE.BoxGeometry(16, 1.4, 5.8);
    const upperDeckMesh = new THREE.Mesh(upperDeckGeom, secMat);
    upperDeckMesh.position.set(-0.5, 1.6, 0);
    fuselageGroup.add(upperDeckMesh);

    // Tapered nose connection neck (transitions from hull to brain dome)
    const neckGeom = new THREE.CylinderGeometry(2.4, 3.2, 4.5, 16);
    neckGeom.rotateZ(Math.PI / 2);
    const neckMesh = new THREE.Mesh(neckGeom, darkMat);
    neckMesh.position.set(-8.5, 1.0, 0);
    fuselageGroup.add(neckMesh);

    // Lower aerodynamic sensor pod / belly scoop
    const chinGeom = new THREE.ConeGeometry(2.2, 7.0, 16);
    chinGeom.rotateZ(-Math.PI / 2);
    const chinMesh = new THREE.Mesh(chinGeom, hullMat);
    chinMesh.position.set(-9.5, -0.6, 0);
    fuselageGroup.add(chinMesh);

    // Mid-hull longitudinal chamfer armor strips
    for (const zSign of [-1, 1]) {
      const ribGeom = new THREE.BoxGeometry(18, 0.5, 0.4);
      const rib = new THREE.Mesh(ribGeom, darkMat);
      rib.position.set(0.5, 1.8, zSign * 3.1);
      fuselageGroup.add(rib);

      const lowerRibGeom = new THREE.BoxGeometry(20, 0.4, 0.4);
      const lowerRib = new THREE.Mesh(lowerRibGeom, secMat);
      lowerRib.position.set(0.5, -0.4, zSign * 3.4);
      fuselageGroup.add(lowerRib);
    }

    this.realisticGroup.add(fuselageGroup);

    // Blueprint Clone
    const bpFuselage = fuselageGroup.clone();
    bpFuselage.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = bpMat;
      }
    });
    this.blueprintGroup.add(bpFuselage);
  }

  /**
   * 2. Front Cockpit: Glowing 3D Brain & Transparent Canopy
   */
  private createBrainCanopySection(glassMat: THREE.Material, bpMat: THREE.Material) {
    const brainSection = new THREE.Group();
    brainSection.position.set(-12.8, 1.2, 0);

    // --- Glass Canopy Shell (Aerodynamic egg / teardrop nose dome) ---
    const canopyGeom = new THREE.SphereGeometry(3.6, 32, 24, 0, Math.PI * 2, 0, Math.PI / 1.7);
    canopyGeom.scale(1.5, 0.95, 1.05);
    canopyGeom.rotateZ(Math.PI / 2);

    const glassCanopy = new THREE.Mesh(canopyGeom, glassMat);
    glassCanopy.position.set(0, 0, 0);
    brainSection.add(glassCanopy);

    // Canopy metallic frame ribs
    const frameRibGeom = new THREE.TorusGeometry(3.1, 0.08, 8, 32, Math.PI * 1.2);
    frameRibGeom.rotateY(Math.PI / 2);
    const frameRibMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const frameRib = new THREE.Mesh(frameRibGeom, frameRibMat);
    frameRib.position.set(0.8, -0.2, 0);
    brainSection.add(frameRib);

    // --- Detailed 3D Brain Model Inside ---
    const brainModel = new THREE.Group();
    brainModel.position.set(-0.2, 0.1, 0);

    // Left & Right Cerebral Hemispheres
    const brainMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.35,
      metalness: 0.2,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.65
    });

    for (const side of [-1, 1]) {
      const hemisphere = new THREE.Group();
      hemisphere.position.z = side * 0.75;

      // Frontal lobe
      const frontalGeom = new THREE.SphereGeometry(1.0, 16, 16);
      frontalGeom.scale(1.2, 0.9, 0.85);
      const frontal = new THREE.Mesh(frontalGeom, brainMat);
      frontal.position.set(-0.6, 0.3, 0);
      hemisphere.add(frontal);

      // Parietal & Occipital lobe (mid/back)
      const parietalGeom = new THREE.SphereGeometry(1.1, 16, 16);
      parietalGeom.scale(1.3, 0.95, 0.85);
      const parietal = new THREE.Mesh(parietalGeom, brainMat);
      parietal.position.set(0.6, 0.3, 0);
      hemisphere.add(parietal);

      // Temporal lobe (lower)
      const temporalGeom = new THREE.SphereGeometry(0.85, 14, 14);
      temporalGeom.scale(1.3, 0.7, 0.8);
      const temporal = new THREE.Mesh(temporalGeom, brainMat);
      temporal.position.set(0.1, -0.4, side * 0.15);
      hemisphere.add(temporal);

      // Cerebellum (rear base)
      const cerebellumGeom = new THREE.SphereGeometry(0.7, 12, 12);
      cerebellumGeom.scale(0.9, 0.65, 0.8);
      const cerebellum = new THREE.Mesh(cerebellumGeom, brainMat);
      cerebellum.position.set(1.1, -0.6, 0);
      hemisphere.add(cerebellum);

      // Organic gyri / sulci surface convolutions (curved ridges)
      for (let i = 0; i < 7; i++) {
        const torusGeom = new THREE.TorusGeometry(0.5 + (i % 3) * 0.2, 0.1, 8, 20, Math.PI);
        torusGeom.rotateX(Math.PI / 2 + (i * 0.4));
        torusGeom.rotateY(i * 0.5);
        const fold = new THREE.Mesh(torusGeom, brainMat);
        fold.position.set((i % 4) * 0.4 - 0.6, 0.1 + (i % 3) * 0.2, side * 0.2);
        hemisphere.add(fold);
      }

      brainModel.add(hemisphere);
    }

    // Brainstem linking downward to the ship's neural conduit network
    const stemGeom = new THREE.CylinderGeometry(0.35, 0.5, 1.4, 12);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8
    });
    const stem = new THREE.Mesh(stemGeom, stemMat);
    stem.position.set(0.5, -1.0, 0);
    brainModel.add(stem);

    // Inner Glowing Light inside the brain
    this.brainGlowLight = new THREE.PointLight(0x38bdf8, 3.5, 12);
    this.brainGlowLight.position.set(0, 0.2, 0);
    brainModel.add(this.brainGlowLight);

    const pinkCoreLight = new THREE.PointLight(0xf472b6, 2.0, 8);
    pinkCoreLight.position.set(-0.3, 0.3, 0);
    brainModel.add(pinkCoreLight);

    // Animated Synaptic Particle Cloud
    const particleCount = 70;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 2.6;
      particlePositions[i + 1] = (Math.random() - 0.5) * 1.8 + 0.1;
      particlePositions[i + 2] = (Math.random() - 0.5) * 2.0;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.15,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const sparkParticles = new THREE.Points(particleGeom, particleMat);
    brainModel.add(sparkParticles);
    this.neuralSparks.push(sparkParticles);

    brainSection.add(brainModel);
    this.realisticGroup.add(brainSection);

    // Dynamic Pulsing Animation Hook for Brain
    this.animatedPulseElements.push((time) => {
      const pulse = 1 + Math.sin(time * 3.5) * 0.035;
      brainModel.scale.set(pulse, pulse, pulse);
      if (this.brainGlowLight) {
        this.brainGlowLight.intensity = 2.8 + Math.sin(time * 5.0) * 1.2;
      }
      sparkParticles.rotation.y = time * 0.4;
    });

    // Blueprint Clone
    const bpBrainSection = brainSection.clone();
    bpBrainSection.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = bpMat;
      }
    });
    this.blueprintGroup.add(bpBrainSection);
  }

  /**
   * 3. Glowing Neural & Energy Conduit Pipelines (Blue from brain, Orange mid, Green aft)
   */
  private createNeuralConduits(
    blueMat: THREE.Material,
    orangeMat: THREE.Material,
    greenMat: THREE.Material,
    bpMat: THREE.Material
  ) {
    const conduitsGroup = new THREE.Group();

    // Generator function for 3D curved tube conduits
    const createTube = (points: THREE.Vector3[], radius: number, mat: THREE.Material) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const geom = new THREE.TubeGeometry(curve, 32, radius, 8, false);
      const mesh = new THREE.Mesh(geom, mat);
      return mesh;
    };

    // --- BLUE NEURAL PATHWAYS (Streaming from brain back into midsection) ---
    for (const zSide of [-1, 1]) {
      // Upper Blue Neural Conduit
      const upperBluePts = [
        new THREE.Vector3(-12.0, 1.2, zSide * 1.5),
        new THREE.Vector3(-10.0, 1.4, zSide * 2.8),
        new THREE.Vector3(-7.0, 1.8, zSide * 3.1),
        new THREE.Vector3(-4.0, 1.7, zSide * 3.0),
        new THREE.Vector3(-1.0, 1.4, zSide * 2.8)
      ];
      conduitsGroup.add(createTube(upperBluePts, 0.12, blueMat));

      // Lower Blue Neural Conduit
      const lowerBluePts = [
        new THREE.Vector3(-11.5, 0.4, zSide * 1.2),
        new THREE.Vector3(-9.5, 0.2, zSide * 2.6),
        new THREE.Vector3(-6.5, -0.2, zSide * 3.2),
        new THREE.Vector3(-3.5, -0.1, zSide * 3.1),
        new THREE.Vector3(0.0, 0.1, zSide * 2.9)
      ];
      conduitsGroup.add(createTube(lowerBluePts, 0.11, blueMat));

      // --- ORANGE ENERGY VEINS (Branching through the midsection) ---
      const midOrangePts1 = [
        new THREE.Vector3(-7.5, 1.1, zSide * 3.0),
        new THREE.Vector3(-5.0, 0.8, zSide * 3.2),
        new THREE.Vector3(-2.0, 0.6, zSide * 3.1),
        new THREE.Vector3(1.5, 0.7, zSide * 3.0),
        new THREE.Vector3(4.5, 0.9, zSide * 2.8)
      ];
      conduitsGroup.add(createTube(midOrangePts1, 0.16, orangeMat));

      const midOrangePts2 = [
        new THREE.Vector3(-4.0, 1.6, zSide * 3.0),
        new THREE.Vector3(-1.0, 1.2, zSide * 3.2),
        new THREE.Vector3(2.5, 0.3, zSide * 3.2),
        new THREE.Vector3(5.0, 0.4, zSide * 2.9)
      ];
      conduitsGroup.add(createTube(midOrangePts2, 0.13, orangeMat));

      // --- GREEN BIO-ENERGY DUCTS (Flowing into the stern botanical sector) ---
      const greenBioPts = [
        new THREE.Vector3(4.0, 0.6, zSide * 2.9),
        new THREE.Vector3(6.5, 0.8, zSide * 3.2),
        new THREE.Vector3(9.5, 0.9, zSide * 3.3),
        new THREE.Vector3(12.5, 0.7, zSide * 2.8),
        new THREE.Vector3(14.2, 0.4, zSide * 1.8)
      ];
      conduitsGroup.add(createTube(greenBioPts, 0.15, greenMat));
    }

    this.realisticGroup.add(conduitsGroup);

    // Blueprint Clone
    const bpConduits = conduitsGroup.clone();
    bpConduits.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = bpMat;
      }
    });
    this.blueprintGroup.add(bpConduits);
  }

  /**
   * 4. Cutaway Observation Decks & Illuminated Interior Windows (Midsection)
   */
  private createObservationCutaways(darkMat: THREE.Material, bpMat: THREE.Material) {
    const cutawayGroup = new THREE.Group();

    // Warm amber interior room recessed cutaway (showing deck floors & hangar bay)
    for (const zSide of [-1, 1]) {
      // Large panoramic bay recess
      const recessGeom = new THREE.BoxGeometry(6.5, 2.0, 0.8);
      const recessMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.6,
        metalness: 0.3
      });
      const recess = new THREE.Mesh(recessGeom, recessMat);
      recess.position.set(0.5, 0.9, zSide * 2.7);
      cutawayGroup.add(recess);

      // Interior glowing catwalk floor & consoles
      const deckFloorGeom = new THREE.BoxGeometry(6.2, 0.1, 0.6);
      const deckFloorMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const deckFloor = new THREE.Mesh(deckFloorGeom, deckFloorMat);
      deckFloor.position.set(0.5, 0.8, zSide * 2.7);
      cutawayGroup.add(deckFloor);

      // Structural framing arches
      for (let i = -2; i <= 2; i++) {
        const pillarGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.8);
        const pillar = new THREE.Mesh(pillarGeom, darkMat);
        pillar.position.set(0.5 + i * 1.3, 0.9, zSide * 3.05);
        cutawayGroup.add(pillar);
      }

      // Interior warm amber light casting out of the window
      const interiorAmberLight = new THREE.PointLight(0xf59e0b, 1.8, 8);
      interiorAmberLight.position.set(0.5, 1.0, zSide * 2.8);
      cutawayGroup.add(interiorAmberLight);
    }

    this.realisticGroup.add(cutawayGroup);

    // Blueprint Clone
    const bpCutaways = cutawayGroup.clone();
    bpCutaways.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = bpMat;
      }
    });
    this.blueprintGroup.add(bpCutaways);
  }

  /**
   * 5. Rear Arboretum, Biosphere & Botanical Domes (Stern Sanctuary)
   */
  private createArboretumBiosphere(
    glassBioMat: THREE.Material,
    hullMat: THREE.Material,
    bpMat: THREE.Material
  ) {
    const bioGroup = new THREE.Group();
    bioGroup.position.set(9.0, 1.6, 0);

    // Wide elevated garden terrace platform
    const platformGeom = new THREE.BoxGeometry(9.0, 0.6, 6.8);
    const platform = new THREE.Mesh(platformGeom, hullMat);
    platform.position.set(0, -0.2, 0);
    bioGroup.add(platform);

    // Lush Green Garden Terrain
    const grassGeom = new THREE.BoxGeometry(8.5, 0.2, 6.2);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.8,
      metalness: 0.1
    });
    const grass = new THREE.Mesh(grassGeom, grassMat);
    grass.position.set(0, 0.15, 0);
    bioGroup.add(grass);

    // --- Giant Umbrella / Parasol Canopy Dome (Dominant elevated glass canopy in concept art) ---
    const canopyR = 3.6;
    const parasolGeom = new THREE.SphereGeometry(canopyR, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.8);
    parasolGeom.scale(1.3, 0.65, 1.15);
    const parasolCanopy = new THREE.Mesh(parasolGeom, glassBioMat);
    parasolCanopy.position.set(-0.5, 2.6, 0);
    bioGroup.add(parasolCanopy);

    // Curved structural pillars supporting the large canopy
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const pillarPositions = [
      new THREE.Vector3(-2.8, 1.2, -1.8),
      new THREE.Vector3(-2.8, 1.2, 1.8),
      new THREE.Vector3(1.8, 1.2, -1.8),
      new THREE.Vector3(1.8, 1.2, 1.8)
    ];
    pillarPositions.forEach((pos) => {
      const archGeom = new THREE.CylinderGeometry(0.1, 0.16, 2.8);
      const archPillar = new THREE.Mesh(archGeom, pillarMat);
      archPillar.position.copy(pos);
      archPillar.rotation.z = -0.15 * Math.sign(pos.x);
      bioGroup.add(archPillar);
    });

    // --- Secondary Biosphere Bubble Dome (Stern-most greenhouse dome) ---
    const bubbleGeom = new THREE.SphereGeometry(1.6, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2.1);
    bubbleGeom.scale(1.2, 1.0, 1.1);
    const bubbleDome = new THREE.Mesh(bubbleGeom, glassBioMat);
    bubbleDome.position.set(2.4, 0.2, 0.6);
    bioGroup.add(bubbleDome);

    // --- Procedural 3D Botanical Trees & Foliage inside the Sanctuaries ---
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const treeFoliageMat1 = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 });
    const treeFoliageMat2 = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.6 });

    const treeCoords = [
      { x: -2.2, z: -1.2, s: 0.9 },
      { x: -1.4, z: 0.8, s: 1.1 },
      { x: -0.6, z: -0.4, s: 1.2 },
      { x: 0.4, z: 1.3, s: 0.85 },
      { x: 1.2, z: -1.1, s: 1.0 },
      { x: 2.2, z: 0.5, s: 0.7 }, // inside bubble dome
      { x: 2.6, z: 0.9, s: 0.65 }
    ];

    treeCoords.forEach((t) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(t.x, 0.2, t.z);
      treeGroup.scale.set(t.s, t.s, t.s);

      // Trunk
      const trunkGeom = new THREE.CylinderGeometry(0.08, 0.12, 0.8);
      const trunk = new THREE.Mesh(trunkGeom, treeTrunkMat);
      trunk.position.y = 0.4;
      treeGroup.add(trunk);

      // Foliage Crown (Layered cones/spheres)
      const foliageGeom1 = new THREE.ConeGeometry(0.55, 0.9, 8);
      const foliage1 = new THREE.Mesh(foliageGeom1, treeFoliageMat1);
      foliage1.position.y = 1.0;
      treeGroup.add(foliage1);

      const foliageGeom2 = new THREE.SphereGeometry(0.35, 8, 8);
      const foliage2 = new THREE.Mesh(foliageGeom2, treeFoliageMat2);
      foliage2.position.y = 1.35;
      treeGroup.add(foliage2);

      bioGroup.add(treeGroup);
    });

    // Ambient Biosphere Emerald Point Light
    const bioLight = new THREE.PointLight(0x10b981, 2.5, 10);
    bioLight.position.set(0, 1.8, 0);
    bioGroup.add(bioLight);

    this.realisticGroup.add(bioGroup);

    // Blueprint Clone
    const bpBioGroup = bioGroup.clone();
    bpBioGroup.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = bpMat;
      }
    });
    this.blueprintGroup.add(bpBioGroup);
  }

  /**
   * 6. Top Bridge Superstructure, Masts & Sensor Arrays
   */
  private createSuperstructure(hullMat: THREE.Material, darkMat: THREE.Material, bpMat: THREE.Material) {
    const bridgeGroup = new THREE.Group();

    // Command Tower Castle (upper midsection)
    const towerGeom = new THREE.BoxGeometry(4.5, 1.2, 3.2);
    const tower = new THREE.Mesh(towerGeom, hullMat);
    tower.position.set(3.0, 2.8, 0);
    bridgeGroup.add(tower);

    // Sensor Dish / Top Pod (matching the elongated cylinder pod on top in the reference)
    const topPodGeom = new THREE.CylinderGeometry(0.3, 0.4, 3.2, 16);
    topPodGeom.rotateZ(Math.PI / 2);
    const topPod = new THREE.Mesh(topPodGeom, darkMat);
    topPod.position.set(2.8, 3.7, 0);
    bridgeGroup.add(topPod);

    // Sensor antennae
    const antGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.0);
    const antMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const ant1 = new THREE.Mesh(antGeom, antMat);
    ant1.position.set(4.0, 4.2, 0.6);
    bridgeGroup.add(ant1);

    const ant2 = new THREE.Mesh(antGeom, antMat);
    ant2.position.set(1.6, 4.2, -0.6);
    bridgeGroup.add(ant2);

    this.realisticGroup.add(bridgeGroup);

    // Blueprint Clone
    const bpBridge = bridgeGroup.clone();
    bpBridge.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = bpMat;
      }
    });
    this.blueprintGroup.add(bpBridge);
  }

  /**
   * 7. Stern Thrusters & Rear Engine Array
   */
  private createSternEngines(darkMat: THREE.Material, bpMat: THREE.Material) {
    const enginesGroup = new THREE.Group();

    // Rear engine block under the garden terrace
    const blockGeom = new THREE.BoxGeometry(2.0, 1.4, 5.0);
    const block = new THREE.Mesh(blockGeom, darkMat);
    block.position.set(14.0, 0.6, 0);
    enginesGroup.add(block);

    // Plasma nozzle array
    for (const z of [-1.5, 0, 1.5]) {
      const nozzleGeom = new THREE.CylinderGeometry(0.65, 0.85, 1.4, 16);
      nozzleGeom.rotateZ(Math.PI / 2);
      const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
      const nozzle = new THREE.Mesh(nozzleGeom, nozzleMat);
      nozzle.position.set(15.2, 0.6, z);
      enginesGroup.add(nozzle);

      // Glowing plasma exhaust cone
      const glowGeom = new THREE.ConeGeometry(0.65, 2.2, 16);
      glowGeom.rotateZ(-Math.PI / 2);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85
      });
      const plume = new THREE.Mesh(glowGeom, glowMat);
      plume.position.set(16.5, 0.6, z);
      enginesGroup.add(plume);

      this.animatedPulseElements.push((time) => {
        const flicker = 1 + Math.sin(time * 12 + z) * 0.15;
        plume.scale.set(flicker, 1 + Math.cos(time * 10 + z) * 0.1, flicker);
      });
    }

    this.realisticGroup.add(enginesGroup);

    // Blueprint Clone
    const bpEngines = enginesGroup.clone();
    bpEngines.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = bpMat;
      }
    });
    this.blueprintGroup.add(bpEngines);
  }

  /**
   * 8. Escort Scout Shuttle (Small vessel flying near the mother ship as in the reference)
   */
  private createEscortShuttle(hullMat: THREE.Material, bpMat: THREE.Material) {
    this.escortShuttle = new THREE.Group();
    this.escortShuttle.position.set(-3.5, -2.5, 4.2);
    this.escortShuttle.scale.set(0.65, 0.65, 0.65);

    // Shuttle body
    const bodyGeom = new THREE.ConeGeometry(0.6, 2.4, 4);
    bodyGeom.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeom, hullMat);
    this.escortShuttle.add(body);

    // Shuttle wings
    const wingGeom = new THREE.BoxGeometry(0.8, 0.08, 2.2);
    const wing = new THREE.Mesh(wingGeom, hullMat);
    wing.position.set(-0.2, 0, 0);
    this.escortShuttle.add(wing);

    // Cockpit glow
    const glassGeom = new THREE.SphereGeometry(0.25, 8, 8);
    const glassMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    const glass = new THREE.Mesh(glassGeom, glassMat);
    glass.position.set(-0.8, 0.2, 0);
    this.escortShuttle.add(glass);

    // Thruster trail
    const thrusterGeom = new THREE.ConeGeometry(0.2, 0.8, 8);
    thrusterGeom.rotateZ(-Math.PI / 2);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.8 });
    const plume = new THREE.Mesh(thrusterGeom, thrusterMat);
    plume.position.set(1.4, 0, 0);
    this.escortShuttle.add(plume);

    this.realisticGroup.add(this.escortShuttle);

    // Blueprint Clone
    const bpShuttle = this.escortShuttle.clone();
    bpShuttle.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = bpMat;
      }
    });
    this.blueprintGroup.add(bpShuttle);

    // Subtle floating orbit for the escort shuttle
    this.animatedPulseElements.push((time) => {
      this.escortShuttle.position.y = -2.5 + Math.sin(time * 1.5) * 0.25;
      this.escortShuttle.position.z = 4.2 + Math.cos(time * 1.2) * 0.3;
      this.escortShuttle.rotation.x = Math.sin(time * 1.5) * 0.08;
    });
  }

  public setRenderMode(mode: RenderMode) {
    if (mode === 'blueprint') {
      this.realisticGroup.visible = false;
      this.blueprintGroup.visible = true;
    } else {
      this.realisticGroup.visible = true;
      this.blueprintGroup.visible = false;
    }
  }

  public update(time: number) {
    this.animatedPulseElements.forEach((fn) => fn(time));
  }
}
