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
import { Coordinates, Objects, PaddleDirection } from "./types";
import {
  BALL_RADIUS,
  BALL_SPEED,
  GAME_FIELD_SIZE,
  PADDLE_KEY,
  PADDLE_SIZE,
  PADDLE_SPEED,
  TICKER_INTERVAL,
} from "./constants";
import { bricksFactory } from "./helpers";

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

  public readonly GAME_FIELD_SIZE = GAME_FIELD_SIZE;
  public readonly PADDLE_SIZE = PADDLE_SIZE;
  public readonly BALL_RADIUS = BALL_RADIUS;

  private readonly INITIAL_OBJECTS: Objects = {
    ball: {
      position: {
        x: GAME_FIELD_SIZE.width / 2 - BALL_RADIUS / 2,
        y: GAME_FIELD_SIZE.height / 2 - BALL_RADIUS / 2,
      },
      direction: {
        x: 1,
        y: 1,
      },
    },
    bricks: bricksFactory(),
    collisions: {
      paddle: false,
      floor: false,
      wall: false,
      ceiling: false,
      brick: false,
    },
  };

  private readonly paddlePositionSubject = new BehaviorSubject(
    GAME_FIELD_SIZE.width / 2 - PADDLE_SIZE.width / 2,
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

  private readonly ticker$ = interval(
    TICKER_INTERVAL,
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
        return [PADDLE_KEY.left, PADDLE_KEY.right].includes(key);
      }),
      map((key: string) => {
        return (key === PADDLE_KEY.left ? -1 : 1) as PaddleDirection;
      }),
    ),
    this.keyupEvent$.pipe(map(() => 0 as PaddleDirection)),
  );

  private readonly paddle$ = this.ticker$.pipe(
    withLatestFrom(this.userInput$),
    scan(
      (position, [ticker, direction]) => {
        const minPosition = 0;
        const maxPosition = GAME_FIELD_SIZE.width - PADDLE_SIZE.width;
        const nextPosition =
          position + direction * ticker.deltaTime * PADDLE_SPEED;

        return Math.max(Math.min(nextPosition, maxPosition), minPosition);
      },
      GAME_FIELD_SIZE.width / 2 - PADDLE_SIZE.width / 2,
    ),
  );

  private readonly objects$ = this.ticker$.pipe(
    withLatestFrom(this.paddle$),
    scan(({ ball, bricks }, [ticker, paddle]): Objects => {
      const predictedXPosition =
        ball.position.x + ball.direction.x * ticker.deltaTime * BALL_SPEED;
      const predicatedYPosition =
        ball.position.y + ball.direction.y * ticker.deltaTime * BALL_SPEED;
      const nextXPosition = Math.min(
        Math.max(0, predictedXPosition),
        GAME_FIELD_SIZE.width - BALL_RADIUS,
      );
      const nextYPosition = Math.min(
        Math.max(0, predicatedYPosition),
        GAME_FIELD_SIZE.height - BALL_RADIUS,
      );

      const newBallPosition: Coordinates = {
        x: nextXPosition,
        y: nextYPosition,
      };

      const ballHitPaddle =
        newBallPosition.x + BALL_RADIUS >= paddle &&
        newBallPosition.x <= paddle + PADDLE_SIZE.width &&
        newBallPosition.y + BALL_RADIUS >=
          GAME_FIELD_SIZE.height - PADDLE_SIZE.height;

      const ballHitWall =
        newBallPosition.x <= 0 ||
        newBallPosition.x + BALL_RADIUS >= GAME_FIELD_SIZE.width;

      const ballHitCeiling = newBallPosition.y <= 0;

      const ballHitFloor =
        newBallPosition.y + BALL_RADIUS >= GAME_FIELD_SIZE.height;

      const ballHitBrick = bricks.some((brick) => {
        return (
          newBallPosition.x + BALL_RADIUS >= brick.x &&
          newBallPosition.x <= brick.x + brick.width &&
          newBallPosition.y + BALL_RADIUS >= brick.y &&
          newBallPosition.y <= brick.y + brick.height
        );
      });

      const brickSurvivors = bricks.filter((brick) => {
        return !(
          newBallPosition.x + BALL_RADIUS >= brick.x &&
          newBallPosition.x <= brick.x + brick.width &&
          newBallPosition.y + BALL_RADIUS >= brick.y &&
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
