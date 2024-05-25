const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.send('test');
});

module.exports = app;
