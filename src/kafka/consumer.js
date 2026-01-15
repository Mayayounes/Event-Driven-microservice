import { Kafka } from "kafkajs";

export let consumer;

export const startConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: "event-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    consumer = kafka.consumer({ groupId: "event-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "user-activity", fromBeginning: true });

    console.log("Kafka consumer connected and subscribed!");
    return consumer;
  } catch (error) {
    console.error("Error starting Kafka consumer:", error);
  }
};
