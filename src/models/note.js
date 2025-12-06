import { model, Schema } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, trim: true, default: '' },
    tag: {
      type: String,
      enum: TAGS,
      required: true,
      default: 'Todo',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

noteSchema.index({ title: 'text', content: 'text' });

export const Notes = model('Note', noteSchema);
