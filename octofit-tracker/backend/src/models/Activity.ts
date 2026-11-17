import { Schema, model } from 'mongoose';

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  type: { type: String, required: true },
  minutes: {
    type: Number,
    required: true,
    validate: { validator: (minutes: number) => minutes > 0, message: 'Minutes must be positive' },
  },
  points: { type: Number, required: true },
  occurredAt: { type: Date, required: true },
});

export const Activity = model('Activity', activitySchema);
