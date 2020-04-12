const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/URLsChallenge', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log('Connected and starting to call the following URLs...');
});

const disconnect = () => {
  db.close();
}

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


module.exports = {
  Link,
  Queue,
  createLink,
  createQueue,
  disconnect
}
