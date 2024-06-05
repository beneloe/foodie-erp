require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 5001;

const inventory = require('./routes/inventory');

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/api/inventory', inventory);

app.get('/', (req, res) => {
  res.send('API is working');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
