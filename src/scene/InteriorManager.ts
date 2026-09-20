import * as THREE from 'three';
import { RoomData } from '../types';

export class InteriorManager {
  public group: THREE.Group;
  private animatedProps: Array<(time: number) => void> = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'InteriorGroup';
    this.group.visible = false;
  }

  public buildRoomInterior(room: RoomData) {
    this.clear();
    this.group.visible = true;

    // Room shell (inverted box so interior walls are visible)
    const roomBoxGeom = new THREE.BoxGeometry(11, 5, 9);
    const roomBoxMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      side: THREE.BackSide,
      roughness: 0.6
    });
    const roomShell = new THREE.Mesh(roomBoxGeom, roomBoxMat);
    roomShell.position.set(0, 2.5, 0);
    this.group.add(roomShell);

    // Glowing Ceiling Light matching room theme color
    const roomLight = new THREE.PointLight(room.color, 3.5, 18);
    roomLight.position.set(0, 4.2, 0);
    this.group.add(roomLight);

    // Props customized by room type
    if (room.type === 'makine') {
      // Plasma Fusion Core with spinning containment ring
      const coreGeom = new THREE.SphereGeometry(1.6, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({ 
        color: 0xef4444, 
        emissive: 0xf59e0b, 
        emissiveIntensity: 0.9 
      });
      const core = new THREE.Mesh(coreGeom, coreMat);
      core.position.set(0, 2.2, 0);
      this.group.add(core);

      const ringGeom = new THREE.TorusGeometry(2.4, 0.12, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 2.2, 0);
      this.group.add(ring);

      this.animatedProps.push((time) => {
        ring.rotation.z = time * 2;
        ring.rotation.x = Math.PI / 2 + Math.sin(time) * 0.2;
        core.scale.set(
          1 + Math.sin(time * 6) * 0.08,
          1 + Math.sin(time * 6) * 0.08,
          1 + Math.sin(time * 6) * 0.08
        );
      });
    } else if (room.type === 'seyir') {
      // Panoramic Space Window
      const winGeom = new THREE.PlaneGeometry(9, 4);
      const winMat = new THREE.MeshBasicMaterial({ 
        color: 0x0284c7, 
        transparent: true, 
        opacity: 0.35, 
        side: THREE.DoubleSide 
      });
      const windowPane = new THREE.Mesh(winGeom, winMat);
      windowPane.position.set(0, 2.5, -4.4);
      this.group.add(windowPane);

      // Loungers / Seats
      for (let x = -2.5; x <= 2.5; x += 2.5) {
        const chairGeom = new THREE.BoxGeometry(1.2, 0.8, 1.2);
        const chairMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
        const chair = new THREE.Mesh(chairGeom, chairMat);
        chair.position.set(x, 0.4, -1.8);
        this.group.add(chair);
      }
    } else if (room.type === 'kopru' || room.type === 'sinif') {
      // Holographic table with projector cylinder
      const tableGeom = new THREE.CylinderGeometry(2.2, 2.4, 0.5, 12);
      const tableMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const table = new THREE.Mesh(tableGeom, tableMat);
      table.position.set(0, 0.8, 0);
      this.group.add(table);

      const holoGeom = new THREE.CylinderGeometry(0.6, 0.6, 2.2, 16);
      const holoMat = new THREE.MeshBasicMaterial({ 
        color: 0x22d3ee, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.75 
      });
      const holo = new THREE.Mesh(holoGeom, holoMat);
      holo.position.set(0, 2.0, 0);
      this.group.add(holo);

      this.animatedProps.push((time) => {
        holo.rotation.y = time * 0.8;
      });
    } else if (room.type === 'hangar') {
      // Hangar dock pad & miniature scout craft
      const dockGeo = new THREE.BoxGeometry(6, 0.2, 5);
      const dockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
      const dock = new THREE.Mesh(dockGeo, dockMat);
      dock.position.set(0, 0.1, 0);
      this.group.add(dock);

      const craftGeo = new THREE.ConeGeometry(1.4, 3.2, 4);
      craftGeo.rotateX(-Math.PI / 2);
      const craftMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9 });
      const craft = new THREE.Mesh(craftGeo, craftMat);
      craft.position.set(0, 1.2, 0);
      this.group.add(craft);
    } else if (room.type === 'kafe') {
      // Cafe Bar Counter and Seating
      const counterGeo = new THREE.BoxGeometry(6, 1.1, 1.2);
      const counterMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const counter = new THREE.Mesh(counterGeo, counterMat);
      counter.position.set(0, 0.55, -2);
      this.group.add(counter);

      const plantGeo = new THREE.BoxGeometry(5.6, 0.3, 0.8);
      const plantMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const plant = new THREE.Mesh(plantGeo, plantMat);
      plant.position.set(0, 1.25, -2);
      this.group.add(plant);
    } else {
      // Workstation / Tech Desk
      const deskGeom = new THREE.BoxGeometry(3.5, 1, 1.6);
      const deskMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const desk = new THREE.Mesh(deskGeom, deskMat);
      desk.position.set(0, 0.5, -2);
      this.group.add(desk);
    }
  }

  public clear() {
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    this.animatedProps = [];
    this.group.visible = false;
  }

  public update(time: number) {
    this.animatedProps.forEach((fn) => fn(time));
  }
}
