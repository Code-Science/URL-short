const oneDayInSeconds = 24 * 60 * 60;

class RedisTokenStore {
  constructor(database, ttl = oneDayInSeconds) {
    this._store = database;
    this._ttl = ttl;
  }

  async getToken(url) {
    return this._store.get(`url:${url}`);
  }

  async hasToken(url) {
    const exist = await this._store.exists(`url:${url}`);
    return Boolean(exist);
  }

  async getUrl(token) {
    return this._store.get(`token:${token}`);
  }

  async save(token, url) {
    if (await this.hasToken(url)) return;
    await this._store.msetExpire(this._ttl, `url:${url}`, token, `token:${token}`, url);
  }
}

module.exports = RedisTokenStore;
