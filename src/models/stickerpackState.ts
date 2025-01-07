import { Schema, model } from 'mongoose';

const stickerpackStateSchema = new Schema(
  {
    user_id: { type: Number, required: true },
    current: { type: String, required: true },
  },
  { collection: 'stickerpack_state' }
);

export const stickerpackStateModel = model('stickerpack_state', stickerpackStateSchema);
