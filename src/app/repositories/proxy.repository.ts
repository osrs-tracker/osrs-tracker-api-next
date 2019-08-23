import Axios from 'axios';
import { plainToClass } from 'class-transformer';
import { HiscoreUtils } from '../common/utils/hiscore.utils';
import { XMLUtils } from '../common/utils/xml.utils';
import { ItemProxy, ItemGraph } from '../models/item';
import { NewsPostOSRS } from '../models/news';
import { Hiscore } from '../models/player';

export type HiscoreFetchOptions = {
  username: string,
  type?: string,
};

export type WikiSearchResult = {
  keyword: string,
  url: string,
};

export class ProxyRepository {

  static readonly OSRS_BASE_URL = 'https://services.runescape.com';
  static readonly OSRS_WIKI_API: string = 'https://oldschool.runescape.wiki/api.php';
  static readonly MAX_OSRS_API_TIMOUT = 2000;

  static async getHiscore(options: HiscoreFetchOptions): Promise<Hiscore | null> {
    try {
      const response = await Axios.get<string>(this.buildHiscoreUrl(options), { timeout: this.MAX_OSRS_API_TIMOUT });

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

  static async getItem(id: number): Promise<ItemProxy | null> {
    try {
      const response = await Axios.get<{ item: ItemProxy }>(`${this.OSRS_BASE_URL}/m=itemdb_oldschool/api/catalogue/detail.json?item=${id}`, { timeout: this.MAX_OSRS_API_TIMOUT });
      return plainToClass(ItemProxy, response.data.item);
    } catch (err) {
      if (err.response.status === 404) return null;
      else throw err;
    }
  }

  static async getItemGraph(id: number): Promise<ItemGraph | null> {
    try {
      const response = await Axios.get<ItemGraph>(`${this.OSRS_BASE_URL}/m=itemdb_oldschool/api/graph/${id}.json`, { timeout: this.MAX_OSRS_API_TIMOUT });
      return plainToClass(ItemGraph, response.data);
    } catch (err) {
      if (err.response.status === 404) return null;
      else throw err;
    }
  }

  static async getLatestNews(): Promise<any> {
    const response = await Axios.get<string>(`${this.OSRS_BASE_URL}/m=news/latest_news.rss?oldschool=true`, { timeout: this.MAX_OSRS_API_TIMOUT });

    const parsedXML = await XMLUtils.parseXml(response.data);

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

  static async getWikiSearchResults(query: string, limit: number = 25): Promise<WikiSearchResult[]> {
    const searchUrl = `${this.OSRS_WIKI_API}?action=opensearch&search=${query}&limit=${limit}`;
    const response = await Axios.get<[string, string[], string[], string[]]>(searchUrl, { timeout: this.MAX_OSRS_API_TIMOUT });

    const [, keywords, , urls] = response.data;
    const results = keywords.map<WikiSearchResult>((keyword, index) => ({ keyword, url: urls[index] }));

    return results;
  }

  private static buildHiscoreUrl(options: HiscoreFetchOptions): string {
    switch (options.type) {
      case 'ironman':
        return `${this.OSRS_BASE_URL}/m=hiscore_oldschool_ironman/index_lite.ws?player=${options.username}`;
      case 'ultimate':
      case 'ultimate_ironman':
        return `${this.OSRS_BASE_URL}/m=hiscore_oldschool_ultimate/index_lite.ws?player=${options.username}`;
      case 'hardcore':
      case 'hardcore_ironman':
        return `${this.OSRS_BASE_URL}/m=hiscore_oldschool_hardcore_ironman/index_lite.ws?player=${options.username}`;
      default:
        return `${this.OSRS_BASE_URL}/m=hiscore_oldschool/index_lite.ws?player=${options.username}`;
    }
  }

}
