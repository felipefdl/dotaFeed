const axios      = require('axios');
const jsdom      = require('jsdom');
const RSS        = require('rss');
const micro      = require('micro')
const { JSDOM }  = jsdom;

async function generateFeed() {
  const { data } = await axios('http://store.steampowered.com/news/?appids=570&appgroupname=Dota+2&feed=steam_updates');
  const dom = new JSDOM(data);
  const dUpdates = dom.window.document.querySelectorAll('.newsPostBlock.steam_updates');

  const feed = new RSS({
    title: 'Dota 2 - Changelog',
    feed_url: 'https://dotafeed.herokuapp.com',
    language: 'en',
    ttl: '60',
    categories: ['Games', 'Dota 2'],
  });

  dUpdates.forEach(item => {
    feed.item({
      title: item.querySelector('.posttitle').textContent,
      date: `${item.querySelector('.date').textContent.trim()} ${new Date().getFullYear()}`,
      url: item.querySelector('.posttitle a').href,
      description: dUpdates[0].querySelector('.body').innerHTML
    });
  });

  return feed.xml();
}


const server = micro(async (req, res) => {
  return generateFeed();
});

server.listen(process.env.PORT || 3000)
