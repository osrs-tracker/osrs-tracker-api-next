export class Vote {
  constructor(
    public deviceUuid: string,
    public date: Date,
  ) { }
}

export class NewsPost {
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
