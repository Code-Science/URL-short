const redis = require('redis');
const { promisify } = require('util');

module.exports = function init() {
  const client = redis.createClient();

  addEventListeners();

  return buildApi();

  function addEventListeners() {
    client.on('error', function (error) {
      console.error(error);
    });
    client.on('connect', () => {
      console.log('Database connected');
    });
  }

  function msetExpire(seconds, ...args) {
    return new Promise((resolve, reject) => {
      const multi = client.multi();
      multi.mset(...args);
      args.forEach((arg, i) => {
        if (i % 2 === 0) multi.expire(arg, seconds);
      });
      multi.exec((err, replies) => {
        if (err) return reject(err);
        resolve(replies);
      });
    });
  }

  function buildApi() {
    return ['get', 'set', 'mset', 'exists', 'flushdb', 'select', 'quit'].reduce(
      (api, operation) => {
        return {
          ...api,
          [operation]: promisify(client[operation]).bind(client),
        };
      },
      { msetExpire }
    );
  }
};
