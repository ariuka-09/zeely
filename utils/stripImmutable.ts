// Mongo rejects an update that touches _id, and the timestamps are owned by
// mongoose. Clients send whole documents back, so drop those fields first.
const IMMUTABLE = ["_id", "createdAt", "updatedAt", "__v"];

export function stripImmutable(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => !IMMUTABLE.includes(key))
  );
}
