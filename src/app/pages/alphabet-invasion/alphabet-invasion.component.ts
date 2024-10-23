import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { AsyncPipe, DOCUMENT, NgStyle } from "@angular/common";
import {
  BehaviorSubject,
  filter,
  finalize,
  fromEvent,
  interval,
  map,
  mergeWith,
  Observable,
  scan,
  switchMap,
  takeWhile,
  tap,
} from "rxjs";
import { dropRight } from "lodash-es";
import { PxPipe } from "@shared/pipes/px";
import { InfoWindow } from "@shared/types";
import {
  GameState,
  LetterAction,
  LetterActionName,
  LetterInputAction,
  NewLetterAction,
} from "./types";
import { isLetter, randomLetter, randomLetterXPosition } from "./helpers";
import {
  BEST_SCORE_LS_KEY,
  GAME_END_LETTERS_COUNT,
  GAME_FIELD,
  GAME_NEW_LEVEL_SCORE_THRESHOLD,
  GAME_NEW_LEVEL_SPEED_UP,
  INITIAL_GAME_STATE,
  INITIAL_TICKER_INTERVAL,
} from "./constants";

@Component({
  selector: "app-alphabet-invasion",
  standalone: true,
  imports: [NgStyle, PxPipe, AsyncPipe],
  templateUrl: "./alphabet-invasion.component.html",
  styleUrl: "./alphabet-invasion.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlphabetInvasionComponent implements OnInit {
  private readonly DOCUMENT = inject(DOCUMENT);
  public readonly GAME_FIELD = GAME_FIELD;

  private readonly infoWindowSubject = new BehaviorSubject<InfoWindow | null>(
    null,
  );
  public readonly infoWindow$ = this.infoWindowSubject.asObservable();

  private readonly bestScoreSubject = new BehaviorSubject(
    Number(localStorage.getItem(BEST_SCORE_LS_KEY)) || 0,
  );
  public readonly bestScore$ = this.bestScoreSubject.asObservable();

  public game$ = new Observable<GameState>();

  private readonly intervalSubject = new BehaviorSubject<number>(
    INITIAL_TICKER_INTERVAL,
  );

  private readonly ticker$ = this.intervalSubject.pipe(
    switchMap((i) => {
      return interval(i);
    }),
  );

  private readonly keydownEvent$ = fromEvent<KeyboardEvent>(
    this.DOCUMENT,
    "keydown",
  );

  private readonly letterInput$ = this.keydownEvent$.pipe(
    map(({ key }) => key),
    filter(isLetter),
  );

  private readonly letterActions$: Observable<LetterAction> = this.ticker$.pipe(
    map((): NewLetterAction => {
      return {
        action: LetterActionName.NEW_LETTER,
        payload: {
          letter: randomLetter(),
          xPosition: randomLetterXPosition(),
        },
      };
    }),
    mergeWith(
      this.letterInput$.pipe(
        map((key): LetterInputAction => {
          return {
            action: LetterActionName.LETTER_INPUT,
            payload: { key },
          };
        }),
      ),
    ),
  );

  ngOnInit(): void {
    this.prepareNewGame({ title: "WELCOME!", message: "start the game!" });
  }

  private startGame(): void {
    this.game$ = this.letterActions$.pipe(
      scan<LetterAction, GameState>(
        (
          { letters, level, score }: GameState,
          { action, payload }: LetterAction,
        ) => {
          switch (action) {
            case LetterActionName.NEW_LETTER: {
              const newLetter = { ...payload };
              const nextLetters = [newLetter, ...letters];

              return {
                letters: nextLetters,
                level,
                score,
              };
            }

            case LetterActionName.LETTER_INPUT: {
              const { key } = payload;
              const lastLetter = letters.at(-1);
              const isMatchingKey = lastLetter?.letter === key;

              if (!isMatchingKey) {
                return {
                  letters,
                  level,
                  score,
                };
              }

              const newScore = score + 1;
              const isNewLevel =
                newScore / GAME_NEW_LEVEL_SCORE_THRESHOLD >= level;

              if (newScore > this.bestScoreSubject.getValue()) {
                this.bestScoreSubject.next(newScore);
                localStorage.setItem(BEST_SCORE_LS_KEY, newScore.toString());
              }

              if (isNewLevel) {
                this.intervalSubject.next(
                  this.intervalSubject.getValue() - GAME_NEW_LEVEL_SPEED_UP,
                );
              }

              return {
                letters: dropRight(letters),
                level: isNewLevel ? level + 1 : level,
                score: newScore,
              };
            }
          }
        },
        INITIAL_GAME_STATE,
      ),
      takeWhile(({ letters }) => {
        return letters.length <= GAME_END_LETTERS_COUNT;
      }),
      finalize(() => {
        this.intervalSubject.next(INITIAL_TICKER_INTERVAL);
        this.prepareNewGame({
          title: "GAME OVER!",
          message: "try again!",
        });
      }),
    );
  }

  private prepareNewGame(infoWindow: InfoWindow): void {
    this.showInfoWindow(infoWindow);
    this.setupStartGameListener();
  }

  private showInfoWindow(infoWindow: InfoWindow): void {
    this.infoWindowSubject.next(infoWindow);
  }

  private closeInfoWindow(): void {
    this.infoWindowSubject.next(null);
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
}
