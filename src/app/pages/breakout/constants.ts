import { Size } from "@shared/types";

export const TICKER_INTERVAL = 17;

export const GAME_FIELD_SIZE: Size = {
  width: 960,
  height: 640,
};

export const PADDLE_SIZE: Size = {
  width: 140,
  height: 25,
};

export const PADDLE_SPEED = 500;
export const PADDLE_KEY = {
  left: "ArrowLeft",
  right: "ArrowRight",
};

export const BALL_RADIUS = 20;
export const BALL_SPEED = 400;

export const BRICK_ROWS = 5;
export const BRICK_COLUMNS = 7;
export const BRICK_HEIGHT = 25;
export const BRICK_GAP = 7;
