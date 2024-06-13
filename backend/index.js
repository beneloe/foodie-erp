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
const serviceCostsRoutes = require('./routes/serviceCosts');
const otherCostsRoutes = require('./routes/otherCosts');
const staffingCostsRoutes = require('./routes/staffingCosts');

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/production-orders', productionOrderRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/service-costs', serviceCostsRoutes);
app.use('/api/other-costs', otherCostsRoutes);
app.use('/api/staffing-costs', staffingCostsRoutes);
app.use('/api/kpis', require('./routes/kpis'));

app.get('/', (req, res) => {
  res.send('API is working');
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
