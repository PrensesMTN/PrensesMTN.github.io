import * as THREE from 'three';
import { ROOMS_DATA, DOOR_CONNECTIONS } from '../config/roomsData';
import { RenderMode, RoomData } from '../types';

export class RoomBuilder {
  public group: THREE.Group;
  public roomMeshes: Record<string, THREE.Mesh> = {};
  public doorMeshes: THREE.Mesh[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'RoomBuilderGroup';

    this.createRoomModules();
    this.createDoorConnections();
  }

  private createRoomModules() {
    Object.keys(ROOMS_DATA).forEach((key) => {
      const room: RoomData = ROOMS_DATA[key];

      const roomGeom = new THREE.BoxGeometry(room.size.x, room.size.y, room.size.z);

      const matBlueprint = new THREE.MeshStandardMaterial({
        color: room.color,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });

      const mesh = new THREE.Mesh(roomGeom, matBlueprint);
      mesh.position.set(room.pos.x, room.pos.y, room.pos.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { roomKey: key };

      // Neon Edges
      const edgesGeom = new THREE.EdgesGeometry(roomGeom);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
      const wireframeEdges = new THREE.LineSegments(edgesGeom, lineMat);
      mesh.add(wireframeEdges);

      this.group.add(mesh);
      this.roomMeshes[key] = mesh;
    });
  }

  private createDoorConnections() {
    const doorMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });

    DOOR_CONNECTIONS.forEach((conn) => {
      const r1 = ROOMS_DATA[conn.from];
      const r2 = ROOMS_DATA[conn.to];
      if (!r1 || !r2) return;

      const midX = (r1.pos.x + r2.pos.x) / 2;
      const midZ = (r1.pos.z + r2.pos.z) / 2;

      const doorGeom = new THREE.BoxGeometry(0.8, 1.4, 0.8);
      const doorMesh = new THREE.Mesh(doorGeom, doorMat);
      doorMesh.position.set(midX, 0.7, midZ);
      this.group.add(doorMesh);
      this.doorMeshes.push(doorMesh);
    });
  }

  public setRenderMode(mode: RenderMode) {
    Object.keys(this.roomMeshes).forEach((key) => {
      const mesh = this.roomMeshes[key];
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mode === 'blueprint') {
        mat.wireframe = true;
        mat.opacity = 0.85;
      } else {
        mat.wireframe = false;
        mat.opacity = 0.9;
      }
    });
  }

  public highlightRoom(selectedKey: string | null, renderMode: RenderMode) {
    Object.keys(this.roomMeshes).forEach((key) => {
      const mesh = this.roomMeshes[key];
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (key === selectedKey) {
        mat.color.setHex(0xf59e0b);
        mat.opacity = 0.95;
      } else {
        mat.color.setHex(ROOMS_DATA[key].color);
        mat.opacity = renderMode === 'blueprint' ? 0.85 : 0.9;
      }
    });
  }
}
