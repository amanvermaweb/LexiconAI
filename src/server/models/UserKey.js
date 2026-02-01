import mongoose from "mongoose";

const UserKeySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    provider: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    encryptedKey: {
      type: String,
      required: true,
    },
    lastFour: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

UserKeySchema.index({ userId: 1, provider: 1 }, { unique: true });

export default mongoose.models.UserKey ||
  mongoose.model("UserKey", UserKeySchema);
