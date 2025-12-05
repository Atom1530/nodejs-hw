// src/db/models/notes.js
import { model, Schema } from 'mongoose';

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, trim: true, default: '' },
    tag: {
      type: String,
      enum: [
        'Work',
        'Personal',
        'Meeting',
        'Shopping',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
        'Todo',
      ],
      required: true,
      default: 'Todo',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Notes = model('Note', noteSchema);
