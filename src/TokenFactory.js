const { nanoid } = require('nanoid');
class TokenFactory {
  constructor(store) {
    this._store = store;
  }
  async create(s) {
    if (typeof s !== 'string' || !s) throw new Error('invalid input');
    if (await this._store.hasToken(s)) return await this._store.getToken(s);

    const token = nanoid(10);
    await this._store.save(token, s);
    return token;
  }
}

module.exports = TokenFactory;
