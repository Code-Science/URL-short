const assert = require('assert');
const TokenStore = require('../src/TokenStore');

describe('Token Store', () => {
  let tokenStore;
  beforeEach(() => {
    tokenStore = new TokenStore();
  });
  it('should return token for a given url if it exist', () => {
    tokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(tokenStore.getToken('someUrl'), '0123456789');
  });
  it('should retuns undefined for a given url if token does not exist', () => {
    assert.strictEqual(tokenStore.getToken('someUrl'), undefined);
  });
  it('should indicate when token exist for a given url', () => {
    tokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(tokenStore.hasToken('someUrl'), true);
  });
  it('should indicate when a token does not exist for a given url', () => {
    assert.strictEqual(tokenStore.hasToken('someUrl'), false);
  });
  it('should return url for a given token if it exist', () => {
    tokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(tokenStore.getUrl('0123456789'), 'someUrl');
  });
  it('should return undefined for a given token if it does not exist', () => {
    assert.strictEqual(tokenStore.getUrl('0123456789'), undefined);
  });
  it('should save a given token and url pair if it does not exist', () => {
    tokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(tokenStore.getToken('someUrl'), '0123456789');
  });

  it('should not replace old token with a given token for a given url if pair exist', () => {
    tokenStore.save('0123456789', 'someUrl');
    tokenStore.save('6666666666', 'someUrl');
    assert.strictEqual(tokenStore.getToken('someUrl'), '0123456789');
  });
});
