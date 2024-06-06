const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const PORT = process.env.PORT || 5001;

const inventoryRoutes = require('./routes/inventory');
const purchaseOrderRoutes = require('./routes/purchaseOrders');
const productionOrderRoutes = require('./routes/productionOrders');
const salesOrderRoutes = require('./routes/salesOrders');

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/production-orders', productionOrderRoutes);
app.use('/api/sales-orders', salesOrderRoutes);

app.get('/', (req, res) => {
  res.send('API is working');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
