import { config } from '../../../config/config';
import { Db, MongoClient } from 'mongodb';

export class MongoUtils {
  static db(mongo: MongoClient): Db {
    return mongo.db(config.mongo.database);
  }
}
