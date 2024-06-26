import request from 'request';

export default function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).send('url query parameter is required');
    return;
  }
  request(url).pipe(res);
}
