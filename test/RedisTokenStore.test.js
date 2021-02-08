const assert = require('assert');
const database = require('../db');
const RedisTokenStore = require('../src/RedisTokenStore');

describe('Redis Token Store', () => {
  let tokenStore;
  before(async () => {
    await database.selectdb(3); // database 3 is used for testing only
    tokenStore = new RedisTokenStore(database);
  });
  afterEach(async () => {
    await database.flushdb();
  });
  after(async () => {
    // await database.quit();
  });
  it('should return token for a given url if it exist', async () => {
    await tokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(await tokenStore.getToken('someUrl'), '0123456789');
  });
  it('should retuns undefined for a given url if token does not exist', async () => {
    assert.strictEqual(await tokenStore.getToken('someUrl'), undefined);
  });
  it('should indicate when token exist for a given url', async () => {
    await tokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(await tokenStore.hasToken('someUrl'), true);
  });
  it('should indicate when a token does not exist for a given url', async () => {
    assert.strictEqual(await tokenStore.hasToken('someUrl'), false);
  });
  it('should return url for a given token if it exist', async () => {
    await tokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(await tokenStore.getUrl('0123456789'), 'someUrl');
  });
  it('should return undefined for a given token if it does not exist', async () => {
    assert.strictEqual(await tokenStore.getUrl('0123456789'), undefined);
  });
  it('should save a given token and url pair if it does not exist', async () => {
    await tokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(await tokenStore.getToken('someUrl'), '0123456789');
  });

  it('should not replace old token with a given token for a given url if pair exist', async () => {
    await tokenStore.save('0123456789', 'someUrl');
    await tokenStore.save('6666666666', 'someUrl');
    assert.strictEqual(await tokenStore.getToken('someUrl'), '0123456789');
  });
});
