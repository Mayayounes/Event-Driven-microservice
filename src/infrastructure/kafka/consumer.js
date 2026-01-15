import { Kafka } from "kafkajs";
import { EventService } from "../../domain/events/event.service.js";

const service = new EventService();

const kafka = new Kafka({
  clientId: "event-service",
  brokers: ["kafka:9092"],
});

const consumer = kafka.consumer({ groupId: "event-group" });

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-activity", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      console.log("Kafka consumer received event:", event);
      await service.createEvent(event); // save to MongoDB
    },
  });

  console.log("Kafka consumer connected and subscribed!");
};
