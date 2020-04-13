# URLsCollector
App to collect web links (URL’s) from a given initial web link (URL)

## Requirements
- App receives an URL;
- App finds all links in this given URL;
- App saves these found links in database;
- App lists the saved links in database;
- After collecting all links from the initial URL, the App also collects the links/URLs from the newly found links.

## Assumptions
- The given URL must be a static website;
- The App is not going to follow external links to not generate "infinite" execution since it doesn't want to index the whole internet. Which means, when a URL is typed, app finds and saves all links on that page and follow them to do the same with theirs links IF they're not external links so that it avoids execution time out;

## Set up
- 

## Running the App
- Open the command line
- in URLs_Challenge/src/ run: $ node app.js URL
- App will return the links list on command line
- After running the app and using a client to access the URLsChallenge database, you'll find two different collections called 'links' and 'queues'. The first one is the saved links list, which the app returns when executed. The second one is a links queue, which should be empty at the end of app's execution since every captured link that needs to be visited is stored in this queue and discarded after visited.

## Testing
- $ npm test

## used packages
- [cheerio](https://cheerio.js.org/)
- [jest](https://jestjs.io/)
- [mongoose](https://mongoosejs.com/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)

## Considerations
- The App was built using MongoDB and running in containers using Docker;
- After running the app and open the database, you'll find two different collections
