import assert from "node:assert/strict";
import test from "node:test";
import { stripImmutable } from "./stripImmutable.ts";

test("stripImmutable drops mongo-owned fields, keeps the rest", () => {
  assert.deepEqual(
    stripImmutable({
      _id: "abc",
      __v: 0,
      createdAt: "2026-01-01",
      updatedAt: "2026-01-02",
      name: "Bat",
      status: "Paid",
    }),
    { name: "Bat", status: "Paid" }
  );
});

test("importing the db module without MONGODB_URL does not throw", async () => {
  delete process.env.MONGODB_URL;
  const connectDB = (await import("./mongodb.ts")).default;
  // The env var is only required once a connection is actually attempted.
  await assert.rejects(connectDB, /MONGODB_URL/);
});
