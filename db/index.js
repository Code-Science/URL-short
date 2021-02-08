const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');

client.on('error', function (error) {
  console.error(error);
});
client.on('connect', () => {
  console.log('Database connected');
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);
const mset = promisify(client.mset).bind(client);
const exists = promisify(client.exists).bind(client);
const flushdb = promisify(client.flushdb).bind(client);
const selectdb = promisify(client.select).bind(client);
const quit = promisify(client.quit).bind(client);

module.exports = {
  get,
  set,
  mset,
  exists,
  flushdb,
  selectdb,
  quit,
};
