import { Loan } from "@/utils/models/loanSchema";
import connectDB from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

// =========================================================
// 1. GET - Fetch all loans
// =========================================================
export async function GET() {
  await connectDB();
  try {
    const loans = await Loan.find({}).sort({ createdAt: -1 });
    return NextResponse.json(loans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// =========================================================
// 2. POST - Create a new loan
// =========================================================
export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    delete body._id;
    const newLoan = await Loan.create({ ...body, status: "Pending" });
    return NextResponse.json(newLoan, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Create failed", error },
      { status: 500 }
    );
  }
}

// =========================================================
// 3. PATCH - Update ANY field using ?id=[id]
// =========================================================
export async function PATCH(req: NextRequest) {
  await connectDB();

  // 1. Get the ID from the URL
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    // 2. Get the update data from the request body
    const updates = await req.json();

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
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 }
    );
  }
}

// =========================================================
// 4. DELETE - Remove loan using ?id=[id]
// =========================================================
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await Loan.findByIdAndDelete(id);
    return NextResponse.json({ message: "Loan deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
