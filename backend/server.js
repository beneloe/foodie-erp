require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

const inventoryRoutes = require('./routes/inventory');

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/api/inventory', inventoryRoutes);

app.get('/', (req, res) => {
  res.send('test');
});

module.exports = app;
