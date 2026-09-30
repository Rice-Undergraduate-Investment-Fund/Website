import { holding, timelineEvent } from "./misc";
import { photo, stat, step } from "./objects";
import { person } from "./person";
import { sector } from "./sector";
import { portfolio, siteSettings, trainingProgram } from "./singletons";

export const schemaTypes = [
  // objects
  photo,
  step,
  stat,
  // documents
  person,
  sector,
  holding,
  timelineEvent,
  // singletons
  siteSettings,
  portfolio,
  trainingProgram,
];

export const singletonTypes = new Set(["siteSettings", "portfolio", "trainingProgram"]);
