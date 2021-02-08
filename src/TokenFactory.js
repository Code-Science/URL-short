const { nanoid } = require('nanoid');
class TokenFactory {
  constructor(store) {
    this._store = store;
  }
  create(s) {
    if (typeof s !== 'string' || !s) throw new Error('invalid input');
    if (this._store.hasToken(s)) return this._store.getToken(s);

    const token = nanoid(10);
    this._store.save(token, s);
    return token;
  }
}

module.exports = TokenFactory;
