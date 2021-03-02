const express = require('express');
const TokenFactory = require('./TokenFactory');
const InMemoryTokenStore = require('./InMemoryTokenStore');
const validateUrl = require('./middlewares/validateUrl');
const config = require(`${process.cwd()}/${process.env.URL_SHORTENER_ENV || 'local'}`);

const app = express();
const inMemoryTokenStore = new InMemoryTokenStore();
const tokenFactory = new TokenFactory(inMemoryTokenStore);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/r/:token', async (req, res) => {
  const url = await inMemoryTokenStore.getUrl(req.params.token);
  if (url) return res.redirect(301, url);
  res.status(404).json({ message: 'Unknown short url' });
});

app.post('/shorten', validateUrl, async (req, res) => {
  const token = await tokenFactory.create(req.body.url);
  res.status(200).json({ result: `${config.baseUrl}/r/${token}` });
});

app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});


module.exports = app;
