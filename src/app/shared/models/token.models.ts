export enum TokenSizeEnum {
  SMALL = 1,
  MEDIUM = 2,
  LARGE = 3,
  ENORMOUS = 4,
  GARGANTUAN = 5,
}

export interface TokenPosition {
  x: number;
  y: number;
}

export interface TokenAtribute {
  id: string;
  label: string;
  value: number;
}

export interface MapToken {
  id: string;
  label: string;
  imageUrl: string;
  size: TokenSizeEnum;
  position: TokenPosition;
  lastMovementTime?: number;
  b64File?: string;
  active?: boolean;
  attributes?: TokenAtribute[];
}

export const DEFAULT_TOKEN: MapToken = {
  id: '0',
  label: 'Token',
  imageUrl: 'assets/images/default.jpg',
  size: TokenSizeEnum.MEDIUM,
  position: { x: 50, y: 50 },
  active: false,
}
