import { Ball, Brick, Collisions, Coordinates } from "./types";
import {
  BALL_RADIUS,
  BALL_SPEED,
  BRICK_COLUMNS,
  BRICK_GAP,
  BRICK_HEIGHT,
  BRICK_ROWS,
  GAME_FIELD_SIZE,
  PADDLE_KEY,
  PADDLE_SIZE,
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

export const defineNextBallPosition = (
  ball: Ball,
  deltaTime: number,
): Coordinates => {
  const predictedXPosition =
    ball.position.x + ball.direction.x * deltaTime * BALL_SPEED;
  const predicatedYPosition =
    ball.position.y + ball.direction.y * deltaTime * BALL_SPEED;

  const nextXPosition = Math.min(
    Math.max(0, predictedXPosition),
    GAME_FIELD_SIZE.width - BALL_RADIUS,
  );
  const nextYPosition = Math.min(
    Math.max(0, predicatedYPosition),
    GAME_FIELD_SIZE.height - BALL_RADIUS,
  );

  return {
    x: nextXPosition,
    y: nextYPosition,
  };
};

export const defineCollisions = (
  nextBallPosition: Coordinates,
  paddlePosition: number,
  bricks: Brick[],
): Collisions => {
  const ballHitPaddle =
    nextBallPosition.x + BALL_RADIUS >= paddlePosition &&
    nextBallPosition.x <= paddlePosition + PADDLE_SIZE.width &&
    nextBallPosition.y + BALL_RADIUS >=
      GAME_FIELD_SIZE.height - PADDLE_SIZE.height;

  const ballHitWall =
    nextBallPosition.x <= 0 ||
    nextBallPosition.x + BALL_RADIUS >= GAME_FIELD_SIZE.width;

  const ballHitCeiling = nextBallPosition.y <= 0;

  const ballHitFloor =
    nextBallPosition.y + BALL_RADIUS >= GAME_FIELD_SIZE.height;

  const ballHitBrick = bricks.some((brick) => {
    return defineBallBrickCollision(nextBallPosition, brick);
  });

  return {
    paddle: ballHitPaddle,
    floor: ballHitFloor,
    wall: ballHitWall,
    ceiling: ballHitCeiling,
    brick: ballHitBrick,
  };
};

export const defineBallBrickCollision = (
  ballPosition: Coordinates,
  brick: Brick,
): boolean => {
  return (
    ballPosition.x + BALL_RADIUS >= brick.x &&
    ballPosition.x <= brick.x + brick.width &&
    ballPosition.y + BALL_RADIUS >= brick.y &&
    ballPosition.y <= brick.y + brick.height
  );
};

export const defineNextBallDirection = (
  ball: Ball,
  { wall, brick, paddle, ceiling }: Collisions,
): Coordinates => {
  return {
    x: wall ? -ball.direction.x : ball.direction.x,
    y: brick || paddle || ceiling ? -ball.direction.y : ball.direction.y,
  };
};

export const filterArrowKeys = (key: string): boolean => {
  return [PADDLE_KEY.left, PADDLE_KEY.right].includes(key);
};
