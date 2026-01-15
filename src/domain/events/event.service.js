import { EventRepository } from "./event.repository.js";

export class EventService {
  // Save a new event (from your API or Kafka consumer)
  async createEvent(event) {
    return EventRepository.save(event);
  }

  // Get all events from MongoDB
  async getAllEvents() {
    return EventRepository.getAll();
  }

  // Get events by specific userId
  async getEventsByUser(userId) {
    return EventRepository.getByUser(userId);
  }

  // Analytics: count events grouped by action type
  async getAnalytics() {
    return EventRepository.getAnalytics();
  }
}
