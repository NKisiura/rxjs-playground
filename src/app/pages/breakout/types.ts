import { Coordinates, Size } from "@shared/types";

export type PaddleDirection = 1 | -1 | 0;

export type Brick = Coordinates & Size;

export interface Ball {
  readonly position: Coordinates;
  readonly direction: Coordinates;
}

export interface Collisions {
  readonly paddle: boolean;
  readonly floor: boolean;
  readonly wall: boolean;
  readonly ceiling: boolean;
  readonly brick: boolean;
}

export interface Objects {
  readonly ball: Ball;
  readonly bricks: Brick[];
  readonly collisions: Collisions;
}
