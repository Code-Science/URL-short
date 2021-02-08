class RedisTokenStore {
  constructor(database) {
    this._store = database;
  }

  async getToken(url) {
    const token = await this._store.get(`url:${url}`).catch((err) => {
      if (err) console.error(err);
    });
    if (token) return token;
  }

  async hasToken(url) {
    const exist = await this._store.exists(`url:${url}`);
    return Boolean(exist);
  }

  async getUrl(token) {
    const url = await this._store.get(`token:${token}`);
    if (url) return url;
  }

  async save(token, url) {
    if (await this.hasToken(url)) return;
    await this._store.set(`url:${url}`, token);
    await this._store.set(`token:${token}`, url);
  }
}

module.exports = RedisTokenStore;
