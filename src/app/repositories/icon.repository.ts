
import Axios from 'axios';
import { createWriteStream, exists, mkdir, readFile, stat, Stats, unlinkSync } from 'fs';
import { join } from 'path';
import { Stream } from 'stream';
import { Logger } from '../common/logger';
import { ProxyRepository } from '../repositories/proxy.repository';

export class IconRepository {

  static async getIcon(id: string): Promise<Buffer | null> {
    const iconFolderPath = join(__dirname, '/icons/');
    const iconPath = join(iconFolderPath, `${id}.gif`);
    try {
      await this.verifyFolder(iconFolderPath);
      await this.verifyIcon(iconPath);
      return await this.getIconFile(iconPath);
    } catch (e) {
      const iconUrl = await this.getIconUrl(id);
      if (!iconUrl) {
        return null;
      }
      Logger.logTask('ICON_REPOSITORY', `DOWNLOADING ICON FOR ITEM ${id}`);
      await this.downloadIcon(iconPath, iconUrl);
      return this.getIconFile(iconPath);
    }

  }

  /** Verifies if folder exists, creates it if it doesn't. */
  private static async verifyFolder(path: string): Promise<void> {
    const available = await new Promise<boolean>(resolve => exists(path, (exists) => resolve(exists)));

    if (!available) {
      return new Promise((resolve, reject) => mkdir(path, (err) => err ? reject(err) : resolve()));
    }
  }

  /** Verifies if the icon exists, and will delete it if it has a size of 0. */
  private static async verifyIcon(path: string): Promise<void> {
    const iconStat = await new Promise<Stats>((resolve, reject) =>
      stat(path, (err, stats) => err ? reject(err) : resolve(stats)),
    );
    if (iconStat.size === 0) {
      unlinkSync(path);
    }
  }

  /** Read the previously downloaded icon file from the icon folder. */
  private static getIconFile(path: string): Promise<Buffer> {
    return new Promise((resolve, reject) =>
      readFile(path, (err, data) => err ? reject(err) : resolve(data)),
    );
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
