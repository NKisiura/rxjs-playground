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
  tap,
  withLatestFrom,
} from "rxjs";
import { PxPipe } from "@shared/pipes/px";
import { InfoWindow } from "@shared/types";
import { Objects, PaddleDirection } from "./types";
import {
  BALL_RADIUS,
  GAME_FIELD_SIZE,
  PADDLE_KEY,
  PADDLE_SIZE,
  PADDLE_SPEED,
  TICKER_INTERVAL,
} from "./constants";
import {
  bricksFactory,
  defineBallBrickCollision,
  defineCollisions,
  defineNextBallDirection,
  defineNextBallPosition,
  filterArrowKeys,
} from "./helpers";

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

  private readonly infoWindowSubject = new BehaviorSubject<InfoWindow | null>(
    null,
  );
  public readonly infoWindow$ = this.infoWindowSubject.asObservable();

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
      filter(filterArrowKeys),
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
        const nextPredictedPosition =
          position + direction * ticker.deltaTime * PADDLE_SPEED;

        return Math.max(
          Math.min(nextPredictedPosition, maxPosition),
          minPosition,
        );
      },
      GAME_FIELD_SIZE.width / 2 - PADDLE_SIZE.width / 2,
    ),
  );

  private readonly objects$ = this.ticker$.pipe(
    withLatestFrom(this.paddle$),
    scan(({ ball, bricks }, [ticker, paddle]): Objects => {
      const nextBallPosition = defineNextBallPosition(ball, ticker.deltaTime);
      const collisions = defineCollisions(nextBallPosition, paddle, bricks);
      const nextBallDirection = defineNextBallDirection(ball, collisions);
      const brickSurvivors = bricks.filter((brick) => {
        return !defineBallBrickCollision(nextBallPosition, brick);
      });

      return {
        ball: { position: nextBallPosition, direction: nextBallDirection },
        bricks: brickSurvivors,
        collisions: collisions,
      };
    }, this.INITIAL_OBJECTS),
  );

  ngOnInit(): void {
    this.prepareNewGame({ title: "WELCOME!", message: "start the game!" });
  }

  private prepareNewGame(infoWindow: InfoWindow): void {
    this.showInfoWindow(infoWindow);
    this.resetObjects();
    this.setupStartGameListener();
  }

  private showInfoWindow(infoWindow: InfoWindow): void {
    this.infoWindowSubject.next(infoWindow);
  }

  private closeInfoWindow(): void {
    this.infoWindowSubject.next(null);
  }

  private resetObjects(): void {
    this.paddlePositionSubject.next(
      GAME_FIELD_SIZE.width / 2 - PADDLE_SIZE.width / 2,
    );
    this.objectsSubject.next(this.INITIAL_OBJECTS);
  }

  private setupStartGameListener(): void {
    const startGameSub = this.keydownEvent$
      .pipe(
        map(({ key }) => key),
        filter((key) => key === " "),
        tap(() => {
          this.closeInfoWindow();
          this.startGame();
          startGameSub.unsubscribe();
        }),
      )
      .subscribe();
  }

  private startGame(): void {
    const gameSubscription = combineLatest([
      this.ticker$,
      this.paddle$,
      this.objects$,
    ]).subscribe(([, paddle, objects]) => {
      this.paddlePositionSubject.next(paddle);
      this.objectsSubject.next(objects);

      if (objects.collisions.floor) {
        this.prepareNewGame({ title: "GAME OVER!", message: "try again!" });
        gameSubscription.unsubscribe();
      }

      if (!objects.bricks.length) {
        this.prepareNewGame({ title: "YOU WIN!", message: "play again!" });
        gameSubscription.unsubscribe();
      }
    });
  }
}
