import { XMLParser } from 'fast-xml-parser';

console.log('feedService.js loaded');

const FEEDS = {
  isosceles: 'https://blog.isosceles.com/rss/',
  projectzero: 'https://googleprojectzero.blogspot.com/feeds/posts/default?alt=atom&max-results=100',
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: true,
  parseAttributeValue: true,
});

async function fetchXML(url) {
  const res = await fetch(url);
  const text = await res.text();
  return parser.parse(text);
}

export async function getFeed(feedKey) {
  const url = FEEDS[feedKey];

  // Handle Project Zero (Atom + pagination)
  if (feedKey === 'projectzero') {
    let entries = [];
    let nextUrl = url;

    while (nextUrl) {
      const parsed = await fetchXML(nextUrl);
      const feed = parsed.feed;

      if (!feed) {
        console.log('No feed found in Project Zero parsed response.');
        break;
      }

      const pageEntries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
      entries = entries.concat(pageEntries);

      // Find the next link
      const nextLinkObj = (Array.isArray(feed.link) ? feed.link : [feed.link])
        .find(link => link['@_rel'] === 'next');
      nextUrl = nextLinkObj ? nextLinkObj['@_href'] : null;
    }

    console.log(`Project Zero parsed ${entries.length} articles`);
    return entries
      .map((entry) => ({
        title: entry.title?.['#text'] || entry.title || 'Untitled',
        link:
          (Array.isArray(entry.link)
            ? entry.link.find((l) => l['@_rel'] === 'alternate')?.['@_href']
            : entry.link?.['@_href']) || '',
        pubDate: entry.updated || entry.published || '',
      }))
      .filter((item) => item.title && item.link)
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  }

  // Handle Isosceles (RSS)
  else {
    const parsed = await fetchXML(url);
    const items = parsed?.rss?.channel?.item || [];

    return items
      .map((item) => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate || '',
      }))
      .filter((item) => item.title && item.link)
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  }
}