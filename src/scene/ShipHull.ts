import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RenderMode } from '../types';

export class ShipHull {
  public group: THREE.Group;
  public realisticGroup: THREE.Group;
  public blueprintGroup: THREE.Group;

  // GLTF loaded model reference
  public gltfModel: THREE.Group | null = null;
  public isLoaded: boolean = false;

  // Emissive dynamic pulsing materials
  private emissiveMaterials: Array<{
    material: THREE.MeshStandardMaterial;
    baseIntensity: number;
    pulseSpeed: number;
    colorChannel: 'cyan' | 'amber' | 'green' | 'plasma' | 'brain';
  }> = [];

  // Procedural animated texture offsets
  private animatedTextures: THREE.Texture[] = [];

  // Brain & cockpit lights
  private brainPointLight!: THREE.PointLight;
  private enginePointLightStarboard!: THREE.PointLight;
  private enginePointLightPort!: THREE.PointLight;

  // Escort shuttle reference
  private escortShuttle: THREE.Group | null = null;

  // Authentic Concept Artwork Decal Group
  public decalGroup: THREE.Group = new THREE.Group();
  public isConceptOverlayEnabled: boolean = true;

  // Theme tracking
  public currentTheme: 'dark' | 'light' = 'dark';

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Mothership_Vessel_Root';

    this.realisticGroup = new THREE.Group();
    this.realisticGroup.name = 'Mothership_Realistic_PBR_Group';

    this.blueprintGroup = new THREE.Group();
    this.blueprintGroup.name = 'Mothership_Blueprint_Group';

    this.group.add(this.realisticGroup);
    this.group.add(this.blueprintGroup);
    this.realisticGroup.add(this.decalGroup);

    // Initial state: 3D realistic mode active
    this.realisticGroup.visible = true;
    this.blueprintGroup.visible = false;

    // Load High-Fidelity GLTF model and set up PBR materials
    this.loadGLTFSpaceshipModel();
  }

  /**
   * Helper: Creates procedural emissive neon light maps via HTML Canvas
   */
  private createNeonConduitTexture(coreColor: string, glowColor: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Dark cyber background
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glowing multi-lane energy lines
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(0.3, glowColor);
      gradient.addColorStop(0.5, '#ffffff');
      gradient.addColorStop(0.7, glowColor);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 24, canvas.width, 80);

      // Pulsing node bands
      for (let x = 0; x < canvas.width; x += 64) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + 32, 64, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 1);
    this.animatedTextures.push(tex);
    return tex;
  }

  /**
   * Helper: Creates procedural window grid texture
   */
  private createWindowGridTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Deck rows of warm amber lit windows
      for (let row = 0; row < 4; row++) {
        const y = 16 + row * 26;
        for (let col = 0; col < 32; col++) {
          const x = 12 + col * 15;
          const isLit = Math.sin(col * 13 + row * 7) > -0.2;
          ctx.fillStyle = isLit ? '#fbbf24' : '#1e293b';
          ctx.fillRect(x, y, 9, 14);
        }
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 1);
    return tex;
  }

  /**
   * Loads high-fidelity GLTF spaceship model and configures PBR materials
   */
  private loadGLTFSpaceshipModel() {
    const loader = new GLTFLoader();

    // Procedural emissive textures matching color palette
    const cyanPulseMap = this.createNeonConduitTexture('rgba(0, 210, 255, 0.2)', 'rgba(0, 240, 255, 0.95)');
    const amberPulseMap = this.createNeonConduitTexture('rgba(255, 140, 0, 0.2)', 'rgba(255, 170, 0, 0.95)');
    const greenPulseMap = this.createNeonConduitTexture('rgba(16, 185, 129, 0.2)', 'rgba(0, 255, 136, 0.95)');
    const windowGridMap = this.createWindowGridTexture();

    loader.load(
      '/models/spaceship_hull.glb',
      (gltf) => {
        const model = gltf.scene;
        this.gltfModel = model;
        this.isLoaded = true;

        // Blueprint wireframe material for architectural mode
        const bpLineMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          wireframe: true,
          transparent: true,
          opacity: 0.45
        });

        // Traverse imported GLTF model and enhance with high-fidelity PBR properties
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const name = mesh.name || '';
            const matName = (mesh.material as THREE.Material)?.name || '';

            // 1. Titanium Armor Plating
            if (matName.includes('Titanium') || name.includes('Armor') || name.includes('Spine')) {
              mesh.material = new THREE.MeshStandardMaterial({
                name: 'PBR_Titanium_Armor',
                color: this.currentTheme === 'light' ? 0xd0d7de : 0x222a36,
                metalness: 0.88,
                roughness: 0.25,
                envMapIntensity: 1.3
              });
            }
            // 2. Dark Chassis & Keel
            else if (matName.includes('Chassis') || name.includes('Keel') || matName.includes('Trim')) {
              mesh.material = new THREE.MeshStandardMaterial({
                name: 'PBR_Chassis_Trim',
                color: this.currentTheme === 'light' ? 0x64748b : 0x141b24,
                metalness: 0.82,
                roughness: 0.35
              });
            }
            // 3. Neon Cyan Conduits (Neural)
            else if (matName.includes('Cyan') || name.includes('Cyan') || name.includes('Visor')) {
              const pbrCyan = new THREE.MeshStandardMaterial({
                name: 'PBR_Neon_Cyan',
                color: 0x00d2ff,
                emissive: new THREE.Color(0x00f0ff),
                emissiveIntensity: 2.4,
                emissiveMap: cyanPulseMap,
                roughness: 0.15,
                metalness: 0.2
              });
              mesh.material = pbrCyan;
              this.emissiveMaterials.push({
                material: pbrCyan,
                baseIntensity: 2.4,
                pulseSpeed: 3.2,
                colorChannel: 'cyan'
              });
            }
            // 4. Neon Amber Conduits (Power)
            else if (matName.includes('Amber') || name.includes('Amber')) {
              const pbrAmber = new THREE.MeshStandardMaterial({
                name: 'PBR_Neon_Amber',
                color: 0xff9900,
                emissive: new THREE.Color(0xffaa00),
                emissiveIntensity: 2.3,
                emissiveMap: amberPulseMap,
                roughness: 0.15,
                metalness: 0.2
              });
              mesh.material = pbrAmber;
              this.emissiveMaterials.push({
                material: pbrAmber,
                baseIntensity: 2.3,
                pulseSpeed: 2.8,
                colorChannel: 'amber'
              });
            }
            // 5. Neon Green Conduits (Biosphere)
            else if (matName.includes('Green') || name.includes('Green') || name.includes('Bio')) {
              const pbrGreen = new THREE.MeshStandardMaterial({
                name: 'PBR_Neon_Green',
                color: 0x10b981,
                emissive: new THREE.Color(0x00ff88),
                emissiveIntensity: 2.1,
                emissiveMap: greenPulseMap,
                roughness: 0.2,
                metalness: 0.1
              });
              mesh.material = pbrGreen;
              this.emissiveMaterials.push({
                material: pbrGreen,
                baseIntensity: 2.1,
                pulseSpeed: 2.4,
                colorChannel: 'green'
              });
            }
            // 6. Cognitive Brain Tissue
            else if (matName.includes('Brain') || name.includes('Brain') || name.includes('Synapse')) {
              const pbrBrain = new THREE.MeshStandardMaterial({
                name: 'PBR_Brain_Tissue',
                color: 0x93c5fd,
                emissive: new THREE.Color(0x38bdf8),
                emissiveIntensity: 1.6,
                roughness: 0.28,
                metalness: 0.12
              });
              mesh.material = pbrBrain;
              this.emissiveMaterials.push({
                material: pbrBrain,
                baseIntensity: 1.6,
                pulseSpeed: 2.0,
                colorChannel: 'brain'
              });
            }
            // 7. Glass Canopies (PBR Physical Transmission)
            else if (matName.includes('Glass') || name.includes('Canopy') || name.includes('Dome')) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                name: 'PBR_Glass_Transmission',
                color: name.includes('Bio') ? 0x86efac : 0xa5f3fc,
                transparent: true,
                opacity: 0.38,
                roughness: 0.06,
                metalness: 0.1,
                transmission: 0.9,
                ior: 1.45,
                side: THREE.DoubleSide
              });
            }
            // 8. Observation Window Deck Array
            else if (matName.includes('Window') || name.includes('Window')) {
              const pbrWindow = new THREE.MeshStandardMaterial({
                name: 'PBR_Window_Array',
                color: 0xfef08a,
                emissive: new THREE.Color(0xf59e0b),
                emissiveIntensity: 2.0,
                emissiveMap: windowGridMap,
                roughness: 0.2
              });
              mesh.material = pbrWindow;
            }
            // 9. Ion Engine Plasma Nozzles
            else if (matName.includes('Plasma') || name.includes('Engine') || name.includes('Exhaust')) {
              const pbrPlasma = new THREE.MeshStandardMaterial({
                name: 'PBR_Plasma_Thruster',
                color: 0x38bdf8,
                emissive: new THREE.Color(0x00d2ff),
                emissiveIntensity: 3.8,
                roughness: 0.1,
                metalness: 0.4
              });
              mesh.material = pbrPlasma;
              this.emissiveMaterials.push({
                material: pbrPlasma,
                baseIntensity: 3.8,
                pulseSpeed: 4.5,
                colorChannel: 'plasma'
              });
            }
          }
        });

        // Add Realistic Model
        this.realisticGroup.add(model);

        // Add Brain Point Light inside canopy
        this.brainPointLight = new THREE.PointLight(0x00f0ff, 2.5, 12);
        this.brainPointLight.position.set(-11.0, 1.2, 0);
        this.realisticGroup.add(this.brainPointLight);

        // Add Engine Exhaust Glow Lights
        this.enginePointLightStarboard = new THREE.PointLight(0x00d2ff, 3.0, 14);
        this.enginePointLightStarboard.position.set(16.5, 0.5, 1.5);
        this.realisticGroup.add(this.enginePointLightStarboard);

        this.enginePointLightPort = new THREE.PointLight(0x00d2ff, 3.0, 14);
        this.enginePointLightPort.position.set(16.5, 0.5, -1.5);
        this.realisticGroup.add(this.enginePointLightPort);

        // Create Architectural Blueprint Wireframe Clone
        const bpModel = model.clone();
        bpModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).material = bpLineMat;
          }
        });
        this.blueprintGroup.add(bpModel);

        // Track companion scout shuttle for hovering
        const shuttle = model.getObjectByName('Escort_Scout_Shuttle');
        if (shuttle) {
          this.escortShuttle = shuttle as THREE.Group;
        }

        // Apply authentic exterior concept art skin as subtle flanking panels
        this.addAuthenticExteriorDecals();
      },
      undefined,
      (error) => {
        console.warn('GLTF load failed, using procedural geometry fallback:', error);
      }
    );
  }

  /**
   * Adds the authentic concept artwork side plating onto the GLTF vessel with transparent background
   */
  private addAuthenticExteriorDecals() {
    const texLoader = new THREE.TextureLoader();
    texLoader.load('/mothership_concept_nobg.png', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;

      // Pure transparent material with alphaTest to completely discard black space background
      const skinMatStarboard = new THREE.MeshStandardMaterial({
        map: tex,
        emissiveMap: tex,
        emissive: new THREE.Color(0xffffff),
        emissiveIntensity: 0.22,
        roughness: 0.35,
        metalness: 0.45,
        transparent: true,
        alphaTest: 0.22, // Discard transparent pixels so no black rectangular quad or wall exists!
        depthWrite: false, // Prevent depth occluding 3D hull geometry
        side: THREE.FrontSide
      });

      const skinMatPort = skinMatStarboard.clone();

      const skinGeom = new THREE.PlaneGeometry(31.5, 9.8);

      // Starboard side (+Z facing)
      const decalStarboard = new THREE.Mesh(skinGeom, skinMatStarboard);
      decalStarboard.name = 'Decal_Starboard_Concept';
      decalStarboard.position.set(0.5, 1.3, 2.75);
      this.decalGroup.add(decalStarboard);

      // Port side (-Z facing with flipped UV so bow faces forward)
      const portGeom = skinGeom.clone();
      const uvs = portGeom.attributes.uv;
      for (let i = 0; i < uvs.count; i++) {
        uvs.setX(i, 1.0 - uvs.getX(i));
      }
      uvs.needsUpdate = true;

      const decalPort = new THREE.Mesh(portGeom, skinMatPort);
      decalPort.name = 'Decal_Port_Concept';
      decalPort.position.set(0.5, 1.3, -2.75);
      decalPort.rotation.y = Math.PI;
      this.decalGroup.add(decalPort);
    });
  }

  /**
   * Toggle or set concept overlay visibility
   */
  public setConceptOverlay(enabled: boolean) {
    this.isConceptOverlayEnabled = enabled;
    this.decalGroup.visible = enabled;
  }

  public toggleConceptOverlay(): boolean {
    this.setConceptOverlay(!this.isConceptOverlayEnabled);
    return this.isConceptOverlayEnabled;
  }

  /**
   * Adapts PBR materials and lighting for Dark vs Light theme
   */
  public setTheme(theme: 'dark' | 'light') {
    this.currentTheme = theme;

    if (!this.gltfModel) return;

    this.gltfModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (!mat || !mat.name) return;

        if (mat.name === 'PBR_Titanium_Armor') {
          mat.color.setHex(theme === 'light' ? 0xd0d7de : 0x222a36);
          mat.roughness = theme === 'light' ? 0.32 : 0.25;
        } else if (mat.name === 'PBR_Chassis_Trim') {
          mat.color.setHex(theme === 'light' ? 0x64748b : 0x141b24);
        }

        // Adjust emissive intensities for light mode so neon remains crisp
        if (mat.emissive) {
          if (theme === 'light') {
            mat.emissiveIntensity *= 0.85;
          } else {
            mat.emissiveIntensity = 2.4;
          }
        }
      }
    });

    if (this.brainPointLight) {
      this.brainPointLight.intensity = theme === 'light' ? 1.8 : 2.5;
    }
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
    // 1. Shift animated texture UV offsets to simulate glowing electrical pulses
    this.animatedTextures.forEach((tex, idx) => {
      tex.offset.x = (time * (0.35 + idx * 0.1)) % 1;
    });

    // 2. Pulse emissive neon light materials with neural heartbeat
    this.emissiveMaterials.forEach((item) => {
      const pulse = 1.0 + Math.sin(time * item.pulseSpeed) * 0.35;
      item.material.emissiveIntensity = item.baseIntensity * pulse;
    });

    // 3. Brain light pulse
    if (this.brainPointLight) {
      this.brainPointLight.intensity = (this.currentTheme === 'light' ? 1.8 : 2.5) + Math.sin(time * 3.0) * 0.6;
    }

    // 4. Hovering escort scout shuttle
    if (this.escortShuttle) {
      this.escortShuttle.position.y = -2.4 + Math.sin(time * 1.6) * 0.2;
      this.escortShuttle.position.z = -3.2 + Math.cos(time * 1.2) * 0.25;
      this.escortShuttle.rotation.x = Math.sin(time * 1.4) * 0.06;
    }
  }
}
