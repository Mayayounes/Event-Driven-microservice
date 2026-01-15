import express from "express";
import { producer } from "../infrastructure/kafka/producer.js";
import { EventService } from "../domain/events/event.service.js";

const router = express.Router();
const service = new EventService();

// Endpoint to send events
router.post("/events", async (req, res) => {
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
router.get("/events/user/:userId", async (req, res) => {
const events = await service.getEventsByUser(req.params.userId);
  res.json(events);
});

//get all events
router.get("/events", async (req, res) => {
    const events = await service.getAllEvents();
    res.json(events);
});

//count events by action
router.get("/analytics/actions", async (req, res) => {
    const stats = await service.getAnalytics();
    res.json(stats);
});
export default router;
