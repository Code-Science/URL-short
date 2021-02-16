module.exports = validateUrl;

function validateUrl(req, res, next) {
  if (!req.body.url) throw new Error('A valid url is required');
  try {
    new URL(req.body.url);
  } catch (err) {
    throw new Error(err.message);
  }
  next();
}
