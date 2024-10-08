const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;

const inventoryRoutes = require('./routes/inventory');
const purchaseOrderRoutes = require('./routes/purchaseOrders');
const productionOrderRoutes = require('./routes/productionOrders');
const salesOrderRoutes = require('./routes/salesOrders');
const serviceCostsRoutes = require('./routes/serviceCosts');
const otherCostsRoutes = require('./routes/otherCosts');
const staffingCostsRoutes = require('./routes/staffingCosts');
const kpiRoutes = require('./routes/kpis');
const authenticationRoutes = require('./routes/authentication');

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
      reportUri: ['/csp-violation-report-endpoint'],
      upgradeInsecureRequests: [],
      blockAllMixedContent: [],
      frameAncestors: ["'self'"],
    },
  })
);
app.use(helmet.hsts({ maxAge: 63072000 }));
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));

app.set('trust proxy', 'loopback');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 10000 requests per window in 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.use('/api/authentication', authenticationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/production-orders', productionOrderRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/service-costs', serviceCostsRoutes);
app.use('/api/other-costs', otherCostsRoutes);
app.use('/api/staffing-costs', staffingCostsRoutes);
app.use('/api/kpis', kpiRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;