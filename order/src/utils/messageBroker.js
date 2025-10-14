const amqp = require("amqplib");
const config = require("../config");
const OrderService = require("../services/orderService");

class MessageBroker {
  static async connect() {
    try {
      console.log("🔌 Connecting to RabbitMQ at", config.rabbitMQURI);

      // Kết nối RabbitMQ từ config
      const connection = await amqp.connect(config.rabbitMQURI);
      const channel = await connection.createChannel();

      // Khai báo queue
      await channel.assertQueue(config.rabbitMQQueue, { durable: true });

      // Lắng nghe messages từ queue
      channel.consume(config.rabbitMQQueue, async (message) => {
        try {
          const order = JSON.parse(message.content.toString());
          console.log("📥 Received order:", order);

          const orderService = new OrderService();
          await orderService.createOrder(order);

          channel.ack(message);
          console.log("✅ Order processed");
        } catch (error) {
          console.error("❌ Error processing message:", error);
          channel.reject(message, false);
        }
      });

      console.log("✅ RabbitMQ connected & consuming messages");
    } catch (error) {
      console.error("❌ Failed to connect to RabbitMQ:", error.message);
    }
  }
}

module.exports = MessageBroker;
