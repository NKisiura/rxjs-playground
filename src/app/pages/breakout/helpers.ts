import { Brick } from "./types";
import {
  BRICK_COLUMNS,
  BRICK_GAP,
  BRICK_HEIGHT,
  BRICK_ROWS,
  GAME_FIELD_SIZE,
} from "./constants";

export const bricksFactory = (): Brick[] => {
  const totalGaps = BRICK_COLUMNS + 1;
  const brickWidth =
    GAME_FIELD_SIZE.width / BRICK_COLUMNS -
    (totalGaps * BRICK_GAP) / BRICK_COLUMNS;

  const bricks: Brick[] = [];

  for (let rowIndex = 0; rowIndex < BRICK_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < BRICK_COLUMNS; colIndex++) {
      bricks.push({
        x: colIndex * (brickWidth + BRICK_GAP) + BRICK_GAP,
        y: rowIndex * (BRICK_HEIGHT + BRICK_GAP) + BRICK_GAP,
        width: brickWidth,
        height: BRICK_HEIGHT,
      });
    }
  }

  return bricks;
};
