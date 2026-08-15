import { Loan } from "@/utils/models/loanSchema";
import connectDB from "@/utils/mongodb";
import { stripImmutable } from "@/utils/stripImmutable";
import { NextRequest, NextResponse } from "next/server";

// =========================================================
// 1. GET - Fetch all loans
// =========================================================
export async function GET() {
  try {
    await connectDB();
    const loans = await Loan.find({}).sort({ createdAt: -1 });
    return NextResponse.json(loans);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
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
    console.error("Create Error:", error);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
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
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
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
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
