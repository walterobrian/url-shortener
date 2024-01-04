import { Client, Databases } from 'node-appwrite';

/**
 * @typedef {Object} URLEntry
 * @property {string} url
 *
 * @typedef {import('node-appwrite').Models.Document & URLEntry} URLEntryDocument
 */

class AppwriteService {
  constructor() {
    const client = new Client();
    client
      .setEndpoint(
        process.env.APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1'
      )
      .setProject("656e2c43a574f664ebd8")
      .setKey("0c90a26f4f90c7efc70123374989596ba45b90c451ba538fc3cd545e899374c479943e209a538606226666d1b4dab7b5277fb6c25d59351995034568982aa39209648bba1504cb495af94db8f661529516c49633075b76b995f393e32cd5503f3a625e890eee233efd935a35f83ac9a2ed23a515ce00661c3f46116fc867aaa3");

    this.databases = new Databases(client);
  }

  /**
   * @param {string} shortCode
   * @returns {Promise<URLEntryDocument | null>}
   */
  async getURLEntry(shortCode) {
    try {
      const document = /** @type {URLEntryDocument} */ (
        await this.databases.getDocument(
          "656e2d6d5ee9c0a6c953",
          "656e2f4485d720af38f2",
          shortCode
        )
      );

      return document;
    } catch (err) {
      if (err.code !== 404) throw err;
      return null;
    }
  }

  /**
   * @param {string} url
   * @param {string} shortCode
   * @returns {Promise<URLEntryDocument | null>}
   */
  async createURLEntry(url, shortCode) {
    try {
      const document = /** @type {URLEntryDocument} */ (
        await this.databases.createDocument(
"656e2d6d5ee9c0a6c953",
          "656e2f4485d720af38f2",
          shortCode,
          {
            url,
          }
        )
      );

      return document;
    } catch (err) {
      if (err.code !== 409) throw err;
      return null;
    }
  }

  /**
   * @returns {Promise<boolean>}
   */
  async doesURLEntryDatabaseExist() {
    try {
      await this.databases.get("656e2d6d5ee9c0a6c953");
      return true;
    } catch (err) {
      if (err.code !== 404) throw err;
      return false;
    }
  }

  async setupURLEntryDatabase() {
    try {
      await this.databases.create(
        "656e2d6d5ee9c0a6c953",
        'URL Shortener'
      );
    } catch (err) {
      // If resource already exists, we can ignore the error
      if (err.code !== 409) throw err;
    }
    try {
      await this.databases.createCollection(
"656e2d6d5ee9c0a6c953",
          "656e2f4485d720af38f2",
        'URLs'
      );
    } catch (err) {
      if (err.code !== 409) throw err;
    }
    try {
      await this.databases.createUrlAttribute(
"656e2d6d5ee9c0a6c953",
          "656e2f4485d720af38f2",
        'url',
        true
      );
    } catch (err) {
      if (err.code !== 409) throw err;
    }
  }
}

export default AppwriteService;
