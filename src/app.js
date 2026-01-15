import express from "express";
import dotenv from "dotenv";
import { connectProducer } from "./infrastructure/kafka/producer.js";
import { startConsumer } from "./infrastructure/kafka/consumer.js";
import { connectDB } from "./infrastructure/mongodb.js";
import eventRouter from "./application/event.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect Kafka producer
connectProducer().catch(console.error);
//consumer
startConsumer().catch(console.error)

app.use("/", eventRouter);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
