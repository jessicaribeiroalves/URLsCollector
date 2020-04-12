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

## Installation

## Running the App

## Considerations
