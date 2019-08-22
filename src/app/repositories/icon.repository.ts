
import Axios from 'axios';
import { createWriteStream, exists, mkdir, readFile, stat, unlink } from 'fs';
import { join } from 'path';
import { Stream } from 'stream';
import { promisify } from 'util';
import { Logger } from '../common/logger';
import { ProxyRepository } from '../repositories/proxy.repository';

export class IconRepository {

  static async getIcon(id: string): Promise<Buffer | null> {
    const iconFolderPath = join(__dirname, '/icons/');
    const iconPath = join(iconFolderPath, `${id}.gif`);

    try {
      await this.verifyFolder(iconFolderPath);
      await this.verifyIcon(iconPath);
    } catch (e) {
      const iconUrl = await this.getIconUrl(id);
      if (!iconUrl) return null;

      Logger.logTask('ICON_REPOSITORY', `DOWNLOADING ICON FOR ITEM ${id}`);
      await this.downloadIcon(iconPath, iconUrl);
    }
    return promisify(readFile)(iconPath);
  }

  /** Verifies if folder exists, creates it if it doesn't. */
  private static async verifyFolder(path: string): Promise<void> {
    const available = await promisify(exists)(path);

    if (!available) {
      return promisify(mkdir)(path);
    }
  }

  /** Verifies if the icon exists, and will delete it if it has a size of 0. */
  private static async verifyIcon(path: string): Promise<void> {
    const stats = await promisify(stat)(path);

    if (stats.size === 0) {
      await promisify(unlink)(path);
      throw new Error('FILE WITH SIZE 0');
    }
  }

  /** Fetches the item and retrieves the icon url from the response. */
  private static async getIconUrl(id: string): Promise<string | null> {
    try {
      const item = await ProxyRepository.getItem(Number(id));
      return item ? item.icon_large : item;
    } catch (e) {
      return null;
    }
  }

  /** Downloads the icon to the icons folder so we can access it faster the next time. */
  private static async downloadIcon(path: string, url: string): Promise<void> {
    const response = await Axios.get<Stream>(url, { responseType: 'stream' });

    const writer = createWriteStream(path);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

}
