const assert = require('assert');
const TokenFactory = require('../src/TokenFactory');
const TokenStore = require('../src/TokenStore');
const RedisTokenStore = require('../src/RedisTokenStore');
const database = require('../db');

describe('Token Factory initiated with Token Store', () => {
  let tokenFactory;
  beforeEach(() => {
    tokenFactory = new TokenFactory(new TokenStore());
  });
  it('should reject empty values', async () => {
    await assert.rejects(tokenFactory.create(''), {
      message: 'invalid input',
    });
  });

  it('should reject null values', async () => {
    await assert.rejects(tokenFactory.create(null), {
      message: 'invalid input',
    });
  });

  it('should reject undefined values', async () => {
    await assert.rejects(tokenFactory.create(undefined), {
      message: 'invalid input',
    });
  });

  it('should generate short tokens', async () => {
    const token = await tokenFactory.create('uzma');
    assert.strictEqual(token.length, 10);
  });

  it('should generate a different url per input', async () => {
    assert.notStrictEqual(
      await tokenFactory.create('uzma'),
      await tokenFactory.create('ali')
    );
  });

  it('should generate same url for same input', async () => {
    assert.strictEqual(
      await tokenFactory.create('uzma'),
      await tokenFactory.create('uzma')
    );
  });

  it('should obfuscate the input value', async () => {
    assert.notStrictEqual(await tokenFactory.create('uzma'), 'uzma');
  });
});

describe('Token Factory initiated with Redis Token Store', () => {
  let tokenFactory;
  before(async () => {
    await database.selectdb(3); // database 3 is used for testing only
    tokenFactory = new TokenFactory(new RedisTokenStore(database));
  });
  afterEach(async () => {
    await database.flushdb();
  });
  after(async () => {
    await database.quit();
  });
  it('should reject empty values', async () => {
    await assert.rejects(tokenFactory.create(''), {
      message: 'invalid input',
    });
  });

  it('should reject null values', async () => {
    await assert.rejects(tokenFactory.create(null), {
      message: 'invalid input',
    });
  });

  it('should reject undefined values', async () => {
    await assert.rejects(tokenFactory.create(undefined), {
      message: 'invalid input',
    });
  });

  it('should generate short tokens', async () => {
    const token = await tokenFactory.create('uzma');
    assert.strictEqual(token.length, 10);
  });

  it('should generate a different url per input', async () => {
    assert.notStrictEqual(
      await tokenFactory.create('uzma'),
      await tokenFactory.create('ali')
    );
  });

  it('should generate same url for same input', async () => {
    assert.strictEqual(
      await tokenFactory.create('uzma'),
      await tokenFactory.create('uzma')
    );
  });

  it('should obfuscate the input value', async () => {
    assert.notStrictEqual(await tokenFactory.create('uzma'), 'uzma');
  });
});
