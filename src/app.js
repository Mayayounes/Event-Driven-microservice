import express from "express";
import dotenv from "dotenv";
import { connectProducer, producer } from "./kafka/producer.js";
import { startConsumer, consumer } from "./kafka/consumer.js";
import { connectDB } from "./mongodb.js";
import { Event } from "./models/event.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect Kafka producer
connectProducer().catch(console.error);

// Start Kafka consumer
startConsumer().then(async () => {
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = message.value.toString();
            console.log("Received message:", value);

            // Save event to MongoDB
            const event = JSON.parse(value);
            try {
                await Event.create(event);
                console.log("Saved event to MongoDB:", event);
            } catch (err) {
                console.error("Error saving event:", err);
            }
        },
    });
}).catch(console.error);

// Endpoint to send events
app.post("/events", async (req, res) => {
    const { userId, action } = req.body;

    if (!userId || !action) {
        return res.status(400).json({ message: "userId and action are required" });
    }

    const event = {
        userId,
        action,
        timestamp: new Date().toISOString(),
    };

    try {
        await producer.send({
            topic: "user-activity",
            messages: [{ value: JSON.stringify(event) }],
        });

        res.status(201).json({ message: "Event sent to Kafka", event });
    } catch (err) {
        console.error("Error sending event:", err);
        res.status(500).json({ message: "Error sending event" });
    }
});

//Analytics endpoints
// get events by user
app.get("/events/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const events = await Event.find({ userId: userId.toString() }).sort({ timestamp: -1 });
  res.json(events);
});

//get all events
app.get("/events", async (req, res) => {
    const events = await Event.find().sort({ timestamp: -1 }).limit(100);
    res.json(events);
});

//count events by action
app.get("/analytics/actions", async (req, res) => {
    const stats = await Event.aggregate([
        {
            $group: {
                _id: "$action",
                count: { $sum: 1 },
            },
        },
    ]);
    res.json(stats);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
