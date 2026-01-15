import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    action: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
},
    { timestamps: true }
);

eventSchema.index({action:1 , timestamp:-1})

export const Event = mongoose.model("Event", eventSchema);