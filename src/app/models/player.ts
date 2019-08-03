import { Type } from 'class-transformer';
import { Views } from './view';

export class Hiscore {
  [skill: string]: [number, number, number?];
}

export enum PlayerType {
  Normal = 1,
  Ironman = 2,
  Ultimate = 3,
  HardcoreIronman = 4,
}

export enum PlayerState {
  Default = 0,
  DeIroned = 1,
  DeUltimated = 2,
  Dead = 3,
  DeadDeIroned = 4,
}

export class Datapoint {
  @Type(() => Date)
  date!: Date;
  @Type(() => Hiscore)
  hiscore!: Hiscore;
}

export class Xp {
  @Type(() => Date)
  lastScrape?: Date;
  @Type(() => Datapoint)
  datapoints!: Datapoint[];
}

export class Player {
  username!: string;
  type!: PlayerType;
  state!: PlayerState;
  @Type(() => Xp)
  xp!: Xp;
  @Type(() => Views)
  views!: Views;
}
