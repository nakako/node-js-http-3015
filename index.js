'use strict';
const http = require('http');
const pug = require('pug');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      let data = { path: req.url };
      let setHTML = false;
      let html = '';
      switch (req.url) {
        case '/':
          setHTML = true;
          html = '<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケートフォーム</h1>' +
            '<a href="/enquetes">アンケート一覧</a>' +
            '</body></html>';
          break;

        case '/enquetes':
          setHTML = true;
          html = '<!DOCTYPE html><html lang="ja"><body>' +
            '<h1>アンケート一覧</h1><ul>' +
            '<li><a href="/enquetes/yaki-shabu">焼き肉・しゃぶしゃぶ</a></li>' +
            '<li><a href="/enquetes/rice-bread">ごはん・パン</a></li>' +
            '<li><a href="/enquetes/sushi-pizza">寿司・ピザ</a></li>' +
            '</ul></body></html>';
          break;

        case '/enquetes/yaki-shabu':
          data.firstItem = '焼肉';
          data.secondItem = 'しゃぶしゃぶ';
          break;

        case '/enquetes/rice-bread':
          data.firstItem = 'ごはん';
          data.secondItem = 'パン';
          break;

        case '/enquetes/sushi-pizza':
          data.firstItem = '寿司';
          data.secondItem = 'ピザ';
          break;

        default:
          setHTML = true;
          html = '<!DOCTYPE html><html lang="ja"><body>' +
          '<h1>アンケートがありません</h1>' +
          '</body></html>';
          break;
      }
      if (setHTML === false) {
        res.write(pug.renderFile('./form.pug', data));
      } else {
        res.write(html);
      }
      res.end();
      break;

    case 'POST':
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const qs = require('querystring');
        const answer = qs.parse(rawData);
        const body = answer['name'] + 'さんは' + answer['favorite'] + 'に投票しました';
        console.info('[' + now + '] ' + body);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
          body + '</h1></body></html>');
      });
      break;

    default:
      break;
  }


}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Client Error', e);
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
