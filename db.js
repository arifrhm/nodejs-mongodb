const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'myapp';

async function connect() {
    try {
        const conn = await mongoose.connect(`${uri}/${dbName}`, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        })
    
        console.log(`MongoDB Connected: ${conn.connection.host}`)
      } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
      }
}

module.exports = {
    connect,
    uri,
    dbName
};