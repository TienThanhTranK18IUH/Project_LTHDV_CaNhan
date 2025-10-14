require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGODB_ORDER_URI || 'mongodb://localhost/orders',
  rabbitMQURI: 'amqp://tienthanh:12345@localhost:5672',
  rabbitMQQueue: 'orders',
  port: 3002
};