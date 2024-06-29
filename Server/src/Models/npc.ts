import mongoose, { Schema, Document } from "mongoose";
import { Npc } from "../Interfaces/npc";

// Definir el subesquema para el flujo
const FlowSchema = new Schema({
    0: { type: Boolean, required: true },
    1: { type: String, required: true }
}, { _id: false });

const NpcSchema = new Schema<Npc & Document>({
    name: {
        type: String,
        required: true
    },
    mood: {
        type: Number,
        required: true
    },
    context: {
        type: String,
        required: true
    },
    flow: {
        type: [FlowSchema],
        required: true
    }
});

export default mongoose.model<Npc & Document>('Npc', NpcSchema);
