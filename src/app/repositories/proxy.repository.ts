import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { HiscoreUtils } from '../common/utils/hiscore.utils';
import { ItemGraph, Item } from '../models/item';
import { Hiscore, PlayerType } from '../models/player';
import xml2js from 'xml2js';
import { NewsPostOSRS } from '../models/news';

const OSRS_BASE_URL = 'https://services.runescape.com';

export type HiscoreFetchOptions = {
  username: string,
  type?: PlayerType,
};

export class ProxyRepository {

  static async getHiscore(options: HiscoreFetchOptions): Promise<Hiscore | null> {
    try {
      const response = await axios.get<string>(this.buildHiscoreUrl(options), { timeout: 1000 });

      // Sometimes the api call returns a webpage. We can know by looking at the response headers.
      if (!!response.headers['content-security-policy']) {
        throw Error('"content-securiy-policy" found in response headers.');
      }

      return HiscoreUtils.parseHiscore(response.data);
    } catch (err) {
      if (err.response.status === 404) return null;
      else throw err;
    }
  }

  static async getItem(id: number): Promise<any | null> {
    try {
      const response = await axios.get<any>(`${OSRS_BASE_URL}/m=itemdb_oldschool/api/catalogue/detail.json?item=${id}`, { timeout: 1000 });
      return plainToClass(Item, response.data.item);
    } catch (err) {
      if (err.response.status === 404) return null;
      else throw err;
    }
  }

  static async getItemGraph(id: number): Promise<ItemGraph | null> {
    try {
      const response = await axios.get<ItemGraph>(`${OSRS_BASE_URL}/m=itemdb_oldschool/api/graph/${id}.json`, { timeout: 1000 });
      return plainToClass(ItemGraph, response.data);
    } catch (err) {
      if (err.response.status === 404) return null;
      else throw err;
    }
  }

  static async getLatestNews(): Promise<any> {
    const response = await axios.get<string>(`${OSRS_BASE_URL}/m=news/latest_news.rss?oldschool=true`, { timeout: 1000 });

    const parsedXML = await this.parseXml(response.data);

    const newsPosts = parsedXML.rss.channel[0].item.map((item: any) => new NewsPostOSRS(
      item.title,
      item.pubDate,
      item.link,
      item.description,
      {
        link: item.enclosure[0].$.url,
        type: item.enclosure[0].$.type,
      },
      item.category,
    ));

    return newsPosts;
  }

  private static parseXml(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  private static buildHiscoreUrl(options: HiscoreFetchOptions): string {
    switch (options.type) {
      case PlayerType.Ironman:
        return `${OSRS_BASE_URL}/m=hiscore_oldschool_ironman/index_lite.ws?player=${options.username}`;
      case PlayerType.Ultimate:
        return `${OSRS_BASE_URL}/m=hiscore_oldschool_ultimate/index_lite.ws?player=${options.username}`;
      case PlayerType.HardcoreIronman:
        return `${OSRS_BASE_URL}/m=hiscore_oldschool_hardcore/index_lite.ws?player=${options.username}`;
      default:
        return `${OSRS_BASE_URL}/m=hiscore_oldschool/index_lite.ws?player=${options.username}`;
    }
  }

}
