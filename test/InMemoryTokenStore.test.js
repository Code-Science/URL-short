const assert = require('assert');
const InMemoryTokenStore = require('../src/InMemoryTokenStore');

describe('Token Store', () => {
  let inMemoryTokenStore;

  beforeEach(() => {
    inMemoryTokenStore = new InMemoryTokenStore();
  });

  it('should return token for a given url if it exist', async () => {
    await inMemoryTokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(await inMemoryTokenStore.getToken('someUrl'), '0123456789');
  });

  it('should retuns undefined for a given url if token does not exist', async () => {
    assert.strictEqual(await inMemoryTokenStore.getToken('someUrl'), undefined);
  });

  it('should indicate when token exist for a given url', async () => {
    await inMemoryTokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(await inMemoryTokenStore.hasToken('someUrl'), true);
  });

  it('should indicate when a token does not exist for a given url', async () => {
    assert.strictEqual(await inMemoryTokenStore.hasToken('someUrl'), false);
  });

  it('should return url for a given token if it exist', async () => {
    await inMemoryTokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(await inMemoryTokenStore.getUrl('0123456789'), 'someUrl');
  });

  it('should return undefined for a given token if it does not exist', async () => {
    assert.strictEqual(await inMemoryTokenStore.getUrl('0123456789'), undefined);
  });

  it('should save a given token and url pair if it does not exist', async () => {
    await inMemoryTokenStore.save('0123456789', 'someUrl');
    assert.strictEqual(await inMemoryTokenStore.getToken('someUrl'), '0123456789');
  });

  it('should not replace old token with a given token for a given url if pair exist', async () => {
    await inMemoryTokenStore.save('0123456789', 'someUrl');
    await inMemoryTokenStore.save('6666666666', 'someUrl');
    assert.strictEqual(await inMemoryTokenStore.getToken('someUrl'), '0123456789');
  });
});
