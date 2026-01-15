// src/domain/events/event.repository.js
import mongoose from "mongoose";

// Define Event schema
const eventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

// Create Event model
const EventModel = mongoose.model("Event", eventSchema);

// Repository functions
export const EventRepository = {
  // Save an event to MongoDB
  async save(event) {
    const newEvent = new EventModel(event);
    return await newEvent.save();
  },

  // Get all events
  async getAll() {
    return await EventModel.find().sort({ timestamp: -1 });
  },

  // Get events by userId
  async getByUser(userId) {
    return await EventModel.find({ userId }).sort({ timestamp: -1 });
  },

  // Analytics: count events by action
  async getAnalytics() {
    return await EventModel.aggregate([
      { $group: { _id: "$action", count: { $sum: 1 } } },
    ]);
  },
};
