import { Kafka, Partitioners } from "kafkajs";

export let producer;

export const connectProducer = async () => {
  try {
    const kafka = new Kafka({
      clientId: "event-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    await producer.connect();
    console.log("Kafka producer connected!");
  } catch (error) {
    console.error("Error connecting Kafka producer:", error);
  }
};
