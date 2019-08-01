export class Item {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public current: string,
    public today: string,
    public views: { [page: string]: Date[] },
  ) { }

}
