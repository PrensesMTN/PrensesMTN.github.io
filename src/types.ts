export type RenderMode = 'blueprint' | '3d';

export interface RoomPosition {
  x: number;
  y: number;
  z: number;
}

export interface RoomSize {
  x: number;
  y: number;
  z: number;
}

export type RoomType = 
  | 'hangar' 
  | 'kopru' 
  | 'kafe' 
  | 'wc' 
  | 'makine' 
  | 'tanitim' 
  | 'kiler' 
  | 'seyir' 
  | 'sinif';

export interface RoomData {
  id: string;
  title: string;
  subtitle: string;
  badgeIcon: string;
  pos: RoomPosition;
  size: RoomSize;
  color: number;
  capacity: string;
  doors?: string[];
  desc: string;
  features: string[];
  img: string;
  type: RoomType;
}

export interface HotspotCoordinate {
  key: string;
  x: number;
  y: number;
  visible: boolean;
}
