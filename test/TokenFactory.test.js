const assert = require('assert');
const TokenFactory = require('../src/TokenFactory');
describe('Token Factory', () => {
  let tokenFactory;
  beforeEach(() => {
    tokenFactory = new TokenFactory();
  });
  it('should reject empty values', () => {
    assert.throws(() => {
      tokenFactory.create('');
    }, /invalid input/);
  });

  it('should reject null values', () => {
    assert.throws(() => {
      tokenFactory.create(null);
    }, /invalid input/);
  });

  it('should reject undefined values', () => {
    assert.throws(() => {
      tokenFactory.create(undefined);
    }, /invalid input/);
  });

  it('should generate short tokens', () => {
    const token = tokenFactory.create('uzma');
    assert.strictEqual(token.length, 10);
  });

  it('should generate a different url per input', () => {
    assert.notStrictEqual(
      tokenFactory.create('uzma'),
      tokenFactory.create('ali')
    );
  });

  it('should generate same url for same input', () => {
    assert.strictEqual(
      tokenFactory.create('uzma'),
      tokenFactory.create('uzma')
    );
  });

  it('should obfuscate the input value', () => {
    assert.notStrictEqual(tokenFactory.create('uzma'), 'uzma');
  });
});
