const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};

const browser = await puppeteer.launch({
    ignoreDefaultArgs: ['--disable-extensions'],
  });