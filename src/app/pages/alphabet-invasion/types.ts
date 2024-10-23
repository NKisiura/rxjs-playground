export interface Letter {
  readonly letter: string;
  readonly xPosition: number;
}

export interface GameState {
  readonly score: number;
  readonly level: number;
  readonly letters: Letter[];
}

export enum LetterActionName {
  NEW_LETTER,
  LETTER_INPUT,
}

interface BaseLetterAction<A extends LetterActionName, T> {
  action: A;
  payload: T;
}

export type NewLetterAction = BaseLetterAction<
  LetterActionName.NEW_LETTER,
  Letter
>;
export type LetterInputAction = BaseLetterAction<
  LetterActionName.LETTER_INPUT,
  { key: string }
>;

export type LetterAction = NewLetterAction | LetterInputAction;
