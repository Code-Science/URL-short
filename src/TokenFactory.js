const { nanoid } = require('nanoid');
class TokenFactory {
  constructor() {
    this._store = {};
  }
  create(s) {
    if (typeof s !== 'string' || !s) throw new Error('invalid input');
    if (this._store[s]) return this._store[s];

    const token = nanoid(10);
    this._store[s] = token;
    return token;
  }
}

module.exports = TokenFactory;
