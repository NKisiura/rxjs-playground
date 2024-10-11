import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { AsyncPipe, DOCUMENT, NgStyle } from "@angular/common";
import {
  animationFrameScheduler,
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  fromEvent,
  interval,
  map,
  merge,
  scan,
  shareReplay,
  withLatestFrom,
} from "rxjs";
import { PxPipe } from "@shared/pipes/px";

@Component({
  selector: "app-breakout",
  standalone: true,
  imports: [NgStyle, AsyncPipe, PxPipe],
  templateUrl: "./breakout.component.html",
  styleUrl: "./breakout.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreakoutComponent implements OnInit {
  private readonly document = inject(DOCUMENT);

  private readonly TICKER_INTERVAL = 17;

  public readonly GAME_FIELD_SIZE: Size = {
    width: 960,
    height: 640,
  };

  public readonly PADDLE_WIDTH = 140;
  public readonly PADDLE_HEIGHT = 25;
  private readonly PADDLE_SPEED = 500;
  private readonly PADDLE_KEY = {
    left: "ArrowLeft",
    right: "ArrowRight",
  };

  public readonly BALL_RADIUS = 20;
  private readonly BALL_SPEED = 400;

  private readonly BRICK_ROWS = 5;
  private readonly BRICK_COLUMNS = 7;
  private readonly BRICK_HEIGHT = 25;
  private readonly BRICK_GAP = 7;

  private readonly INITIAL_OBJECTS: Objects = {
    ball: {
      position: {
        x: this.GAME_FIELD_SIZE.width / 2 - this.BALL_RADIUS / 2,
        y: this.GAME_FIELD_SIZE.height / 2 - this.BALL_RADIUS / 2,
      },
      direction: {
        x: 1,
        y: 1,
      },
    },
    bricks: this.bricksFactory(),
    collisions: {
      paddle: false,
      floor: false,
      wall: false,
      ceiling: false,
      brick: false,
    },
  };

  private readonly paddlePositionSubject = new BehaviorSubject(
    this.GAME_FIELD_SIZE.width / 2 - this.PADDLE_WIDTH / 2,
  );
  public readonly paddlePosition$ = this.paddlePositionSubject.pipe(
    distinctUntilChanged(),
  );

  private readonly objectsSubject = new BehaviorSubject(this.INITIAL_OBJECTS);
  public readonly bricks$ = this.objectsSubject.pipe(
    map(({ bricks }) => bricks),
    distinctUntilChanged(),
  );
  public readonly ball$ = this.objectsSubject.pipe(
    map(({ ball }) => ball.position),
    distinctUntilChanged(),
  );

  private bricksFactory(): Brick[] {
    const totalGaps = this.BRICK_COLUMNS + 1;
    const brickWidth =
      this.GAME_FIELD_SIZE.width / this.BRICK_COLUMNS -
      (totalGaps * this.BRICK_GAP) / this.BRICK_COLUMNS;

    const bricks: Brick[] = [];

    for (let rowIndex = 0; rowIndex < this.BRICK_ROWS; rowIndex++) {
      for (let colIndex = 0; colIndex < this.BRICK_COLUMNS; colIndex++) {
        bricks.push({
          x: colIndex * (brickWidth + this.BRICK_GAP) + this.BRICK_GAP,
          y: rowIndex * (this.BRICK_HEIGHT + this.BRICK_GAP) + this.BRICK_GAP,
          width: brickWidth,
          height: this.BRICK_HEIGHT,
        });
      }
    }

    return bricks;
  }

  private readonly ticker$ = interval(
    this.TICKER_INTERVAL,
    animationFrameScheduler,
  ).pipe(
    map((): { time: number; deltaTime: number | null } => ({
      time: Date.now(),
      deltaTime: null,
    })),
    scan((previous, current) => ({
      time: current.time,
      deltaTime: (current.time - previous.time) / 1000,
    })),
    filter(({ deltaTime }) => deltaTime !== null),
    map((ticker) => ticker as { time: number; deltaTime: number }),
    shareReplay(1),
  );

  private readonly keydownEvent$ = fromEvent<KeyboardEvent>(
    this.document,
    "keydown",
  );
  private readonly keyupEvent$ = fromEvent<KeyboardEvent>(
    this.document,
    "keyup",
  );

  private userInput$ = merge(
    this.keydownEvent$.pipe(
      map(({ key }) => key),
      filter((key) => {
        return [this.PADDLE_KEY.left, this.PADDLE_KEY.right].includes(key);
      }),
      map((key: string) => {
        return (key === this.PADDLE_KEY.left ? -1 : 1) as PaddleDirection;
      }),
    ),
    this.keyupEvent$.pipe(map(() => 0 as PaddleDirection)),
  );

  private readonly paddle$ = this.ticker$.pipe(
    withLatestFrom(this.userInput$),
    scan(
      (position, [ticker, direction]) => {
        const minPosition = 0;
        const maxPosition = this.GAME_FIELD_SIZE.width - this.PADDLE_WIDTH;
        const nextPosition =
          position + direction * ticker.deltaTime * this.PADDLE_SPEED;

        return Math.max(Math.min(nextPosition, maxPosition), minPosition);
      },
      this.GAME_FIELD_SIZE.width / 2 - this.PADDLE_WIDTH / 2,
    ),
  );

  private readonly objects$ = this.ticker$.pipe(
    withLatestFrom(this.paddle$),
    scan(({ ball, bricks }, [ticker, paddle]): Objects => {
      const predictedXPosition =
        ball.position.x + ball.direction.x * ticker.deltaTime * this.BALL_SPEED;
      const predicatedYPosition =
        ball.position.y + ball.direction.y * ticker.deltaTime * this.BALL_SPEED;
      const nextXPosition = Math.min(
        Math.max(0, predictedXPosition),
        this.GAME_FIELD_SIZE.width - this.BALL_RADIUS,
      );
      const nextYPosition = Math.min(
        Math.max(0, predicatedYPosition),
        this.GAME_FIELD_SIZE.height - this.BALL_RADIUS,
      );

      const newBallPosition: Coordinates = {
        x: nextXPosition,
        y: nextYPosition,
      };

      const ballHitPaddle =
        newBallPosition.x + this.BALL_RADIUS >= paddle &&
        newBallPosition.x <= paddle + this.PADDLE_WIDTH &&
        newBallPosition.y + this.BALL_RADIUS >=
          this.GAME_FIELD_SIZE.height - this.PADDLE_HEIGHT;

      const ballHitWall =
        newBallPosition.x <= 0 ||
        newBallPosition.x + this.BALL_RADIUS >= this.GAME_FIELD_SIZE.width;

      const ballHitCeiling = newBallPosition.y <= 0;

      const ballHitFloor =
        newBallPosition.y + this.BALL_RADIUS >= this.GAME_FIELD_SIZE.height;

      const ballHitBrick = bricks.some((brick) => {
        return (
          newBallPosition.x + this.BALL_RADIUS >= brick.x &&
          newBallPosition.x <= brick.x + brick.width &&
          newBallPosition.y + this.BALL_RADIUS >= brick.y &&
          newBallPosition.y <= brick.y + brick.height
        );
      });

      const brickSurvivors = bricks.filter((brick) => {
        return !(
          newBallPosition.x + this.BALL_RADIUS >= brick.x &&
          newBallPosition.x <= brick.x + brick.width &&
          newBallPosition.y + this.BALL_RADIUS >= brick.y &&
          newBallPosition.y <= brick.y + brick.height
        );
      });

      const newBallDirection: Coordinates = {
        x: ballHitWall ? -ball.direction.x : ball.direction.x,
        y:
          ballHitBrick || ballHitPaddle || ballHitCeiling ?
            -ball.direction.y
          : ball.direction.y,
      };

      return {
        ball: { position: newBallPosition, direction: newBallDirection },
        bricks: brickSurvivors,
        collisions: {
          paddle: ballHitPaddle,
          floor: ballHitFloor,
          wall: ballHitWall,
          ceiling: ballHitCeiling,
          brick: ballHitBrick,
        },
      };
    }, this.INITIAL_OBJECTS),
  );

  public startGame(): void {
    const gameSubscription = combineLatest([
      this.ticker$,
      this.paddle$,
      this.objects$,
    ]).subscribe(([, paddle, objects]) => {
      this.paddlePositionSubject.next(paddle);
      this.objectsSubject.next(objects);

      if (objects.collisions.floor) {
        alert("Game over");
        gameSubscription.unsubscribe();
      }

      if (!objects.bricks.length) {
        alert("Congratulations");
        gameSubscription.unsubscribe();
      }
    });
  }

  ngOnInit(): void {
    this.startGame();
  }
}

type PaddleDirection = 1 | -1 | 0;

interface Size {
  readonly width: number;
  readonly height: number;
}

interface Coordinates {
  readonly x: number;
  readonly y: number;
}

interface Collisions {
  readonly paddle: boolean;
  readonly floor: boolean;
  readonly wall: boolean;
  readonly ceiling: boolean;
  readonly brick: boolean;
}

type Brick = Coordinates & Size;

interface Ball {
  readonly position: Coordinates;
  readonly direction: Coordinates;
}

export interface Objects {
  readonly ball: Ball;
  readonly bricks: Brick[];
  readonly collisions: Collisions;
}
