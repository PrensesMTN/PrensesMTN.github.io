import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { ShipHull } from '../scene/ShipHull';
import { RoomBuilder } from '../scene/RoomBuilder';
import { InteriorManager } from '../scene/InteriorManager';
import { ROOMS_DATA } from '../config/roomsData';
import { HotspotCoordinate, RenderMode } from '../types';

export interface EngineCallbacks {
  onRoomSelect?: (roomKey: string) => void;
  onHotspotsUpdate?: (hotspots: HotspotCoordinate[]) => void;
}

export class Engine {
  public container: HTMLElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;

  public shipGroup: THREE.Group;
  public hull: ShipHull;
  public roomBuilder: RoomBuilder;
  public interiorManager: InteriorManager;

  private isRunning: boolean = true;
  private animationFrameId: number = 0;
  private resizeObserver: ResizeObserver | null = null;
  private callbacks: EngineCallbacks;
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;

  public selectedRoomKey: string | null = null;
  public currentRenderMode: RenderMode = '3d';
  public isInteriorView: boolean = false;
  public currentTheme: 'dark' | 'light' = 'dark';

  private ambientLight!: THREE.AmbientLight;
  private sunBackLight!: THREE.DirectionalLight;
  private keyLight!: THREE.DirectionalLight;
  private bellyLight!: THREE.DirectionalLight;
  private starField!: THREE.Points;
  private gridHelper!: THREE.GridHelper;

  constructor(container: HTMLElement, callbacks: EngineCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Space Backdrop (Deep space with warm cosmic nebula glow)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060c18);
    this.scene.fog = new THREE.FogExp2(0x060c18, 0.008);

    // 2. Camera - Framed for majestic side profile as in the reference art
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    this.camera.position.set(0, 3.5, 34);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 1.85;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 90;
    this.controls.target.set(0, 1.0, 0);

    // 5. Lighting Setup matching reference art's celestial warmth & rim highlights
    this.ambientLight = new THREE.AmbientLight(0xe2e8f0, 0.85);
    this.scene.add(this.ambientLight);

    // Warm celestial sun backlight (creates rim light on brain dome and armor spine)
    this.sunBackLight = new THREE.DirectionalLight(0xffedd5, 2.4);
    this.sunBackLight.position.set(-18, 12, -22);
    this.scene.add(this.sunBackLight);

    // Primary front-side starship key light
    this.keyLight = new THREE.DirectionalLight(0xecfeff, 1.8);
    this.keyLight.position.set(15, 25, 28);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.scene.add(this.keyLight);

    // Underbelly fill light (soft cyan reflection)
    this.bellyLight = new THREE.DirectionalLight(0x0284c7, 0.6);
    this.bellyLight.position.set(0, -15, 10);
    this.scene.add(this.bellyLight);

    // 6. Stars & Cosmic Dust Particles
    this.createSpaceStars();

    // Subtle tactical holographic grid at bottom
    this.gridHelper = new THREE.GridHelper(100, 50, 0x0284c7, 0x1e293b);
    this.gridHelper.position.y = -3.5;
    this.scene.add(this.gridHelper);

    // 7. Spaceship Hierarchy
    this.shipGroup = new THREE.Group();
    this.scene.add(this.shipGroup);

    this.hull = new ShipHull();
    this.shipGroup.add(this.hull.group);

    this.roomBuilder = new RoomBuilder();
    this.shipGroup.add(this.roomBuilder.group);

    // Initialize in Realistic 3D mode by default to match the artwork!
    this.hull.setRenderMode('3d');
    this.roomBuilder.setRenderMode('3d');

    // 8. Interior Scene
    this.interiorManager = new InteriorManager();
    this.scene.add(this.interiorManager.group);

    // 9. Events & Resize
    this.bindEvents();
    this.setupResizeObserver();

    // Start render loop
    this.tick();
  }

  private createSpaceStars() {
    const starCount = 1500;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0xfef08a), // Warm sun yellow
      new THREE.Color(0xc084fc), // Soft nebula purple
      new THREE.Color(0xffffff)  // Crisp white
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 320;
      positions[idx + 1] = (Math.random() - 0.5) * 260;
      positions[idx + 2] = (Math.random() - 0.5) * 320;

      const clr = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[idx] = clr.r;
      colors[idx + 1] = clr.g;
      colors[idx + 2] = clr.b;
    }

    const starsGeom = new THREE.BufferGeometry();
    starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    this.starField = new THREE.Points(starsGeom, starsMat);
    this.scene.add(this.starField);
  }

  private bindEvents() {
    const el = this.renderer.domElement;

    el.addEventListener('click', (e) => {
      if (this.isInteriorView) return;

      const rect = el.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const meshes = Object.values(this.roomBuilder.roomMeshes);
      const intersects = this.raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const key = hit.object.userData.roomKey;
        if (key && this.callbacks.onRoomSelect) {
          this.callbacks.onRoomSelect(key);
        }
      }
    });
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(width, height);
        }
      }
    });
    this.resizeObserver.observe(this.container);
  }

  public selectRoom(key: string | null) {
    this.selectedRoomKey = key;
    this.roomBuilder.highlightRoom(key, this.currentRenderMode);

    if (key && this.roomBuilder.roomMeshes[key]) {
      const roomMesh = this.roomBuilder.roomMeshes[key];
      const targetPos = roomMesh.position.clone();

      gsap.to(this.controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.0,
        ease: 'power2.out'
      });
    }
  }

  public setRenderMode(mode: RenderMode) {
    this.currentRenderMode = mode;
    this.hull.setRenderMode(mode);
    this.roomBuilder.setRenderMode(mode);
    this.roomBuilder.highlightRoom(this.selectedRoomKey, mode);
  }

  public enterRoomInterior(key: string) {
    const room = ROOMS_DATA[key];
    if (!room) return;

    this.isInteriorView = true;
    this.selectedRoomKey = key;
    this.shipGroup.visible = false;

    this.interiorManager.buildRoomInterior(room);

    gsap.to(this.camera.position, {
      x: 0,
      y: 2,
      z: 5.5,
      duration: 1.5,
      ease: 'power2.inOut'
    });
    gsap.to(this.controls.target, {
      x: 0,
      y: 1.2,
      z: 0,
      duration: 1.5,
      ease: 'power2.inOut'
    });
  }

  public exitRoomInterior() {
    this.isInteriorView = false;
    this.interiorManager.clear();
    this.shipGroup.visible = true;
    this.resetCameraView();
  }

  /**
   * Smoothly animates camera back to the side profile concept view
   */
  public resetCameraView() {
    gsap.to(this.camera.position, {
      x: 0,
      y: 3.5,
      z: 34,
      duration: 1.2,
      ease: 'power2.out'
    });
    gsap.to(this.controls.target, {
      x: 0,
      y: 1.0,
      z: 0,
      duration: 1.2,
      ease: 'power2.out'
    });
  }

  /**
   * Concept Art Profile View (matches illustration exactly)
   */
  public setConceptProfileView() {
    gsap.to(this.camera.position, {
      x: -0.5,
      y: 1.6,
      z: 32,
      duration: 1.2,
      ease: 'power2.out'
    });
    gsap.to(this.controls.target, {
      x: -0.5,
      y: 1.0,
      z: 0,
      duration: 1.2,
      ease: 'power2.out'
    });
  }

  /**
   * Concept Overlay Layer toggle
   */
  public toggleConceptOverlay(): boolean {
    return this.hull.toggleConceptOverlay();
  }

  public setConceptOverlay(enabled: boolean) {
    this.hull.setConceptOverlay(enabled);
  }

  private updateHotspotPositions() {
    if (!this.callbacks.onHotspotsUpdate) return;

    if (this.isInteriorView) {
      this.callbacks.onHotspotsUpdate([]);
      return;
    }

    const tempV = new THREE.Vector3();
    const hotspots: HotspotCoordinate[] = [];
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    Object.keys(ROOMS_DATA).forEach((key) => {
      const mesh = this.roomBuilder.roomMeshes[key];
      if (!mesh) return;

      mesh.getWorldPosition(tempV);
      tempV.y += ROOMS_DATA[key].size.y / 2 + 0.6;
      tempV.project(this.camera);

      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (tempV.y * -0.5 + 0.5) * height;

      hotspots.push({
        key,
        x,
        y,
        visible: tempV.z <= 1
      });
    });

    this.callbacks.onHotspotsUpdate(hotspots);
  }

  public setTheme(theme: 'dark' | 'light') {
    this.currentTheme = theme;

    if (theme === 'light') {
      // Orbital Drydock Pristine Daylight Setting
      this.scene.background = new THREE.Color(0xe2e8f0);
      this.scene.fog = new THREE.FogExp2(0xe2e8f0, 0.005);
      if (this.starField) this.starField.visible = false;

      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xffffff);
        this.ambientLight.intensity = 1.35;
      }
      if (this.sunBackLight) {
        this.sunBackLight.color.setHex(0xfff7ed);
        this.sunBackLight.intensity = 1.8;
      }
      if (this.keyLight) {
        this.keyLight.color.setHex(0xffffff);
        this.keyLight.intensity = 2.2;
      }
      if (this.bellyLight) {
        this.bellyLight.color.setHex(0x94a3b8);
        this.bellyLight.intensity = 0.9;
      }
      if (this.gridHelper) {
        (this.gridHelper.material as THREE.Material).opacity = 0.25;
      }
      this.renderer.toneMappingExposure = 1.05;
    } else {
      // Deep Cosmic Nebula Setting
      this.scene.background = new THREE.Color(0x060c18);
      this.scene.fog = new THREE.FogExp2(0x060c18, 0.008);
      if (this.starField) this.starField.visible = true;

      if (this.ambientLight) {
        this.ambientLight.color.setHex(0xe2e8f0);
        this.ambientLight.intensity = 0.85;
      }
      if (this.sunBackLight) {
        this.sunBackLight.color.setHex(0xffedd5);
        this.sunBackLight.intensity = 2.4;
      }
      if (this.keyLight) {
        this.keyLight.color.setHex(0xecfeff);
        this.keyLight.intensity = 1.8;
      }
      if (this.bellyLight) {
        this.bellyLight.color.setHex(0x0284c7);
        this.bellyLight.intensity = 0.6;
      }
      if (this.gridHelper) {
        (this.gridHelper.material as THREE.Material).opacity = 0.45;
      }
      this.renderer.toneMappingExposure = 1.15;
    }

    if (this.hull) {
      this.hull.setTheme(theme);
    }
  }

  private tick = (time: number = 0) => {
    if (!this.isRunning) return;

    this.controls.update();

    // Gentle ship floating when in exterior view and no room is locked
    if (this.shipGroup && !this.isInteriorView && !this.selectedRoomKey) {
      this.shipGroup.rotation.y = Math.sin(time * 0.0003) * 0.04;
      this.shipGroup.position.y = Math.sin(time * 0.0008) * 0.18;
    }

    this.hull.update(time * 0.001);
    this.interiorManager.update(time * 0.001);

    this.updateHotspotPositions();

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  public destroy() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.controls.dispose();
    this.renderer.dispose();

    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
