import Chance from "chance";
import fontColorContrast from "font-color-contrast";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { BOOKS_DATA_VALUES } from "../../../data/bookReferences";

export const findBookByAbbreviation = (abbreviation: string) => {
  return BOOKS_DATA_VALUES.find((book) => book.abbreviation === abbreviation);
};

const chance = new Chance();
export const getRandomAnimal = () => {
  return chance.animal().replace(/\s$/, "");
};

export const getRandomUserColors = () => {
  const background = chance.color({ casing: "upper", format: "hex" });
  const text = fontColorContrast(background);
  return { background, text };
};

export const getRandomHash = () => {
  return chance.hash();
};

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");
export const getTimeAgoString = (time: string) => {
  return timeAgo.format(new Date(time), "round-minute");
};
