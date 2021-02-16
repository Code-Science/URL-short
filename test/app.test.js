const app = require('../src/app');
const request = require('supertest');
const assert = require('assert');

describe('POST "/shorten"', () => {
  it('should return a shortened version of a given valid url', (done) => {
    request(app)
      .post('/shorten')
      .send({
        url: 'http://example.com/very/long/url',
      })
      .expect('Content-Type', /json/)
      .expect('Content-Length', '47')
      .expect(200)
      .then((response) => {
        assert.strictEqual(response.body.result.length, 34);
        done();
      })
      .catch((err) => done(err));
  });

  it('should return different result per url', (done) => {
    request(app)
      .post('/shorten')
      .send({
        url: 'http://example1.com/very/long/url',
      })
      .expect(200)
      .then((response) => {
        request(app)
          .post('/shorten')
          .send({
            url: 'http://example2.com/very/long/url',
          })
          .expect(200)
          .then((secondResponse) => {
            assert.notStrictEqual(response.body.result, secondResponse.body.result);
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('should return same result for same url', (done) => {
    request(app)
      .post('/shorten')
      .send({
        url: 'http://example.com/very/long/url',
      })
      .expect(200)
      .then((response) => {
        request(app)
          .post('/shorten')
          .send({
            url: 'http://example.com/very/long/url',
          })
          .expect(200)
          .then((secondResponse) => {
            assert.strictEqual(response.body.result, secondResponse.body.result);
            done();
          })
          .catch((err) => done(err));
      })
      .catch((err) => done(err));
  });

  it('should reject missing url', (done) => {
    request(app)
      .post('/shorten')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        assert.strictEqual(response.body.error, 'A valid url is required');
        done();
      })
      .catch((err) => done(err));
  });

  it('should reject invalid url', (done) => {
    request(app)
      .post('/shorten')
      .send({ url: 'http://' })
      .expect('Content-Type', /json/)
      .expect(400)
      .then((response) => {
        assert.strictEqual(response.body.error, 'Invalid URL: http://');
        done();
      })
      .catch((err) => done(err));
  });
});

describe('GET "/r/:token"', () => {
  let savedToken;
  before((done) => {
    request(app)
      .post('/shorten')
      .send({
        url: 'http://exampleGet.com/very/long/url',
      })
      .expect(200)
      .then((response) => {
        savedToken = response.body.result.slice(-10);
        done();
      })
      .catch((err) => done(err));
  });

  it('should redirect request to original url, for a known url', (done) => {
    request(app).get(`/r/${savedToken}`).expect(301).expect('location', 'http://exampleGet.com/very/long/url').end(done);
  });

  it('should return 404 for an unknown url', (done) => {
    request(app)
      .get(`/r/unknown`)
      .expect(404)
      .expect('Content-Type', /json/)
      .then((response) => {
        assert.strictEqual(response.body.message, 'Unknown short url');
        done();
      })
      .catch((err) => done(err));
  });
});
