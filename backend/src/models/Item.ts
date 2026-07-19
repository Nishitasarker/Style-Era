import { Schema, model } from 'mongoose';

const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['child', 'young', 'old'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  styleAttributes: {
    color: String,
    material: String,
    vibe: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional, can be null for seeded items
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Item = model('Item', ItemSchema);
