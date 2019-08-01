
export interface Hiscore {
  [skill: string]: [number, number, number];
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

export class Player {
  constructor(
    public username: string,
    public type: PlayerType,
    public state: PlayerState,
    public xp: {
      lastScrape: Date,
      datapoints: { date: Date, hiscore: Hiscore }[],
    },
    public views: { [page: string]: Date[] },
  ) { }
}
