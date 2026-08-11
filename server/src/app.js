const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const guideRoutes = require('./routes/guides');
const hospitalRoutes = require('./routes/hospitals');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const ratingRoutes = require('./routes/ratings');
const messageRoutes = require('./routes/messages');
const couponRoutes = require('./routes/coupons');
const adminRoutes = require('./routes/admin');

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '医院导诊员交易系统运行中' });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`服务器启动成功，端口: ${config.port}`);
});
