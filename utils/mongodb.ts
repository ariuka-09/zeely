import mongoose, { type Mongoose } from "mongoose";

mongoose.set("bufferCommands", false);

declare global {
  var mongooseCache:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

const cached = (global.mongooseCache ??= { conn: null, promise: null });

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  // Read the env var at request time, not module load time: throwing during
  // module evaluation breaks `next build` page-data collection.
  const MONGODB_URI = process.env.MONGODB_URL;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URL environment variable inside .env.local"
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default connectDB;
