const mongoose = require('mongoose');

// DB Connection
mongoose.connect('mongodb://localhost/URLsChallenge', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected and starting to call the following URLs...');
});

const disconnect = () => {
  db.close();
}
// TODO create connect function to not connect to DB when db.js is required

// DB Schema
const linksSchema = new mongoose.Schema({
  link: String,
  initialUrl: String,
  parentUrl: String,
});
const Link = mongoose.model('Link', linksSchema);

const queueSchema = new mongoose.Schema({
  url: String,
  initialUrl: String,
});
const Queue = mongoose.model('Queue', queueSchema);

// DB CRUD
const createLink = (url, initialUrl, parentUrl) => {
  let link = new Link({
    link: url,
    initialUrl: initialUrl,
    parentUrl: parentUrl
  });
  return link.save();
}

const createQueue = (url, initialUrl) => {
  let queueItem = new Queue({ url: url, initialUrl: initialUrl });
  return queueItem.save();
}

// DB Queries
function getFirstFromQueue() {
  return Queue.findOneAndDelete().exec();
}

function getSavedLinks(url) {
  return Link.find({ initialUrl: url }).exec();
}

async function isKnownUrl(url) {
  const response = await Link.findOne({ link: url }).exec();
  return response !== null
}


module.exports = {
  Link,
  Queue,
  createLink,
  createQueue,
  disconnect,
  getFirstFromQueue,
  getSavedLinks,
  isKnownUrl,
}
