import mongoose from "mongoose";

// console.log(MONGODB_URI, "URI");

mongoose.set({ bufferCommands: false });

const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env.local"
  );
}

declare global {
  var mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    // @ts-ignore - Type issue with mongoose connection caching
    cached!.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    const mongooseInstance = await cached!.promise;
    cached!.conn = mongooseInstance;
    console.log("connection successful");

    return mongooseInstance;
  } catch (e) {
    console.log("FAILED TO CONNECT DB", e, MONGODB_URI);

    cached!.promise = null;
    throw e;
  }
}

export default connectDB;
