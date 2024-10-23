import { Size } from "@shared/types";
import { GameState } from "./types";

export const GAME_FIELD: Size = {
  width: 200,
  height: 360,
};

export const GAME_END_LETTERS_COUNT = 15;
export const GAME_NEW_LEVEL_SCORE_THRESHOLD = 20;
export const GAME_NEW_LEVEL_SPEED_UP = 150;

export const INITIAL_TICKER_INTERVAL = 1000;

export const BEST_SCORE_LS_KEY = "BEST_SCORE";

export const INITIAL_GAME_STATE: GameState = {
  score: 0,
  level: 1,
  letters: [],
};
