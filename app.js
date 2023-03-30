const express = require('express');
const apiV1 = require('./api_v1');
const apiV2 = require('./api_v2');

const app = express();
app.use(express.json());

// Version 1 API endpoints
app.use('/api/v1', apiV1);

// Version 2 API endpoints
app.use('/api/v2', apiV2);

app.listen(3000, () => {
  console.log(app);
  console.log('Server started on port 3000');
});

module.exports = app;