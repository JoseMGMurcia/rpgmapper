export enum TokenSizeEnum {
  SMALL = 1,
  MEDIUM = 2,
  LARGE = 3,
}

export interface TokenPosition {
  x: number;
  y: number;
}
export interface MapToken {
  id: string;
  label: string;
  imageUrl: string;
  size: TokenSizeEnum;
  position: TokenPosition;
  lastMovementTime?: number;
  b64File?: string;
}

export const DEFAULT_TOKEN: MapToken = {
  id: '0',
  label: 'Token',
  imageUrl: 'assets/images/default.jpg',
  size: TokenSizeEnum.MEDIUM,
  position: { x: 50, y: 50 },
}
