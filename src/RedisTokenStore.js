class RedisTokenStore {
  constructor(database) {
    this._store = database;
  }

  async getToken(url) {
    const token = await this._store.get(`url:${url}`);
    return token || undefined;
  }

  async hasToken(url) {
    const exist = await this._store.exists(`url:${url}`);
    return Boolean(exist);
  }

  async getUrl(token) {
    const url = await this._store.get(`token:${token}`);
    return url || undefined;
  }

  async save(token, url) {
    if (await this.hasToken(url)) return;
    await this._store.mset(`url:${url}`, token, `token:${token}`, url);
  }
}

module.exports = RedisTokenStore;
