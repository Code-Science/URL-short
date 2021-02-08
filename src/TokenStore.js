class TokenStore {
  constructor() {
    this._store = {};
  }

  getToken(url) {
    const token = this._store[url];
    return token;
  }

  hasToken(url) {
    return Boolean(this._store[url]);
  }

  getUrl(token) {
    let url;
    Object.keys(this._store).forEach((key) => {
      if (this._store[key] === token) url = key;
    });
    return url;
  }

  save(token, url) {
    if (this._store[url]) return;
    this._store[url] = token;
  }
}

module.exports = TokenStore;
