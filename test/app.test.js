const app = require('../src/app');
const request = require('supertest');
const assert = require('assert');

describe('POST "/shorten"', () => {
  it('should return a shortened version of a given valid url', async () => {
    const response = await shortenUrl('http://example.com/very/long/url');
    assert.strictEqual(response.body.result.length, 34);
    assert.match(response.body.result, /^http:\/\/localhost:3000\/r\/\w{10}$/);
  });

  it('should return different result per url', async () => {
    const response1 = await shortenUrl('http://example1.com/very/long/url');
    const response2 = await shortenUrl('http://example2.com/very/long/url');
    assert.notStrictEqual(response1.body.result, response2.body.result);
  });

  it('should return same result for same url', async () => {
    const response1 = await shortenUrl('http://example.com/very/long/url');
    const response2 = await shortenUrl('http://example.com/very/long/url');
    assert.strictEqual(response1.body.result, response2.body.result);
  });

  it('should reject missing url', async () => {
    const response = await shortenUrl('', 400);
    assert.strictEqual(response.body.error, 'A valid url is required');
  });

  it('should reject invalid url', async () => {
    const response = await shortenUrl('http://', 400);
    assert.strictEqual(response.body.error, 'Invalid URL: http://');
  });
});

describe('GET "/r/:token"', () => {
  let savedToken;

  before(async () => {
    const response = await shortenUrl('http://exampleGet.com/very/long/url');
    savedToken = response.body.result.slice(-10);
  });

  it('should redirect request to original url, for a known url', async () => {
    const response = await redirectToOriginalUrl(savedToken);
    assert.strictEqual(response.header.location, 'http://exampleGet.com/very/long/url');
  });

  it('should return 404 for an unknown url', async () => {
    const response = await redirectToOriginalUrl('unknown', 404);
    assert.strictEqual(response.body.message, 'Unknown short url');
    assert.strictEqual(response.type, 'application/json');
  });
});

function shortenUrl(url, status = 200) {
  return request(app)
    .post('/shorten')
    .send({
      url,
    })
    .expect('Content-Type', /json/)
    .expect(status);
}

function redirectToOriginalUrl(token, status = 301) {
  return request(app).get(`/r/${token}`).expect(status);
}
