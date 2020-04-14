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
- Install and set up [Docker](https://www.docker.com/get-started);
- Suggestion: in case you want to check database as a client, you can use [MongoDB Compass](https://www.mongodb.com/products/compass) for a nicer interface connecting to ```port 27017```.

## Running the App
- On command line: ```$ git clone git@github.com:jessicaribeiroalves/URLsCollector.git```
- ```$ cd URLsCollector```
- ```$ docker-compose run app node src/app.js URL```
- Example to run: ```$ docker-compose run app node src/app.js https://www.nubank.com.br```
- The links list will be shown on command line after app is completely executed.
- After running the app and using a client to access the URLsChallenge database, you'll find two different collections called 'links' and 'queues'. The first one is the saved links list, which the app returns when executed. The second one is a links queue, which should be empty at the end of app's execution since every captured link that needs to be visited is stored in this queue and discarded after visited.

## Testing
- Tests have already been executed when running the app since it is in docker build script, but if you want to run it separately, run the following command:
- ```$ docker-compose run app npm test```

## used packages
- [cheerio](https://cheerio.js.org/)
- [jest](https://jestjs.io/)
- [mongoose](https://mongoosejs.com/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)

## Considerations
- The App was built using MongoDB and it runs in containers using Docker;
