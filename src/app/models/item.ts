import { Type, Exclude } from 'class-transformer';

export enum Trend {
  Negative = 'negative',
  Neutral = 'neutral',
  Positive = 'positive',
}

export class Price {
  price!: string;
  trend!: Trend;
}

export class Change {
  change!: string;
  trend!: Trend;
}

export class Item {
  id!: number;
  name!: string;
  description!: string;

  icon!: string;
  icon_large!: string;

  @Type(() => Price)
  current!: Price;
  @Type(() => Price)
  today!: Price;

  @Type(() => Change)
  day30!: Change;
  @Type(() => Change)
  day90!: Change;
  @Type(() => Change)
  day180!: Change;

  members!: boolean;

  @Exclude()
  type!: string;
  @Exclude()
  typeIcon!: string;
}

export class ItemGraph {
  daily!: { [timestamp: string]: number };
  average!: { [timestamp: string]: number };
}
