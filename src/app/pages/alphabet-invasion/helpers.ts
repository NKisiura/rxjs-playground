import { random } from "lodash-es";
import { GAME_FIELD } from "./constants";

export const randomLetter = () => {
  return String.fromCharCode(
    Math.floor(Math.random() * ("z".charCodeAt(0) - "a".charCodeAt(0) + 1)) +
      "a".charCodeAt(0),
  );
};

export const randomLetterXPosition = () => {
  return random(GAME_FIELD.width - 14);
};

export const isLetter = (key: string) => {
  return /^[a-zA-Z]$/.test(key);
};
