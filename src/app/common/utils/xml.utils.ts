import xml2js from 'xml2js';

export class XMLUtils {
  static parseXml(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
}
