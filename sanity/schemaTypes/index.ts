import { alumniFirm, holding, letter, timelineEvent } from "./misc";
import { alumnus, membersAccess } from "./alumni";
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
  letter,
  alumniFirm,
  alumnus,
  // singletons
  siteSettings,
  portfolio,
  trainingProgram,
  membersAccess,
];

export const singletonTypes = new Set(["siteSettings", "portfolio", "trainingProgram", "membersAccess"]);

/** Types that must only be created through their dedicated Studio entry (private IDs). */
export const privateTypes = new Set(["alumnus"]);
