export class Vote {
  constructor(
    public deviceUuid: string,
    public date: Date,
  ) { }
}

export class NewsPostOSRS {
  constructor(
    public title: string,
    public pubDate: Date,
    public link: string,
    public description: string,
    public enclosure: {
      link: string;
      type: string;
    },
    public categories: string[],
  ) { }
}

export class NewsPostApp {
  constructor(
    public uuid: number,
    public title: string,
    public date: Date,
    public category: string,
    public content: string,
    public upvotes: Vote[],
    public downvotes: Vote[],
    public views: { [page: string]: Date[] },
  ) { }
}
