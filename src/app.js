const { indexAllPages } = require('./index')
const db = require('./db');

const url = process.argv[2]
indexAllPages(url).then(console.log).then(db.disconnect);
