const axios      = require('axios');
const jsdom      = require('jsdom');
const htmlToText = require('html-to-text');
const RSS        = require('rss');
const micro      = require('micro')
const { JSDOM }  = jsdom;

async function generateFeed() {
  const { data } = await axios('http://store.steampowered.com/news/?appids=570&appgroupname=Dota+2&feed=steam_updates');
  const dom = new JSDOM(data);
  const dUpdates = dom.window.document.querySelectorAll('.newsPostBlock.steam_updates');

  const feed = new RSS({
    title: 'Dota 2 updates',
  });

  dUpdates.forEach(item => {
    feed.item({
      title: item.querySelector('.posttitle').textContent,
      description: htmlToText.fromString(dUpdates[0].querySelector('.body').innerHTML)
    });
  });

  return feed.xml();
}


const server = micro(async (req, res) => {
  return generateFeed();
});

server.listen(3000)
