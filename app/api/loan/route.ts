import { Loan } from "@/utils/models/loanSchema";
import connectDB from "@/utils/mongodb";
import { stripImmutable } from "@/utils/stripImmutable";
import { NextRequest, NextResponse } from "next/server";

// A 500 with no detail is impossible to debug from the client, and the raw
// driver error can carry the connection string. Report the config problems
// (which are the common ones) and keep the rest generic.
function failure(action: string, error: unknown) {
  console.error(`${action} Error:`, error);

  if (!process.env.MONGODB_URL) {
    return NextResponse.json(
      { error: "Server is misconfigured: MONGODB_URL is not set" },
      { status: 503 }
    );
  }

  const name = error instanceof Error ? error.name : "";
  if (name === "MongooseServerSelectionError" || name === "MongoServerError") {
    return NextResponse.json(
      { error: `Database unreachable (${name})` },
      { status: 503 }
    );
  }

  // The error class is safe to expose; the message is not.
  return NextResponse.json(
    { error: `${action} failed`, type: name },
    { status: 500 }
  );
}

// =========================================================
// 1. GET - Fetch all loans
// =========================================================
export async function GET() {
  try {
    await connectDB();
    const loans = await Loan.find({}).sort({ createdAt: -1 });
    return NextResponse.json(loans);
  } catch (error) {
    return failure("Fetch", error);
  }
}

// =========================================================
// 2. POST - Create a new loan
// =========================================================
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const newLoan = await Loan.create({
      ...stripImmutable(body),
      status: "Pending",
    });
    return NextResponse.json(newLoan, { status: 201 });
  } catch (error) {
    return failure("Create", error);
  }
}

// =========================================================
// 3. PATCH - Update ANY field using ?id=[id]
// =========================================================
export async function PATCH(req: NextRequest) {
  // 1. Get the ID from the URL
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await connectDB();

    // 2. Get the update data from the request body
    const updates = stripImmutable(await req.json());

    // 3. Find and Update
    // { new: true } returns the document AFTER the changes are applied
    // { runValidators: true } ensures the new data follows your Schema rules
    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedLoan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLoan);
  } catch (error) {
    return failure("Update", error);
  }
}

// =========================================================
// 4. DELETE - Remove loan using ?id=[id]
// =========================================================
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await connectDB();
    const deleted = await Loan.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Loan deleted" });
  } catch (error) {
    return failure("Delete", error);
  }
}
