import { Schema, model, models, Model } from "mongoose";

interface ILoan {
  name: string;
  company: string;
  phoneNumber: string;
  dueDate: Date;
  amount: number;
  status: "Pending" | "Paid" | "Overdue";
  receipt?: string;
}

const LoanSchema = new Schema<ILoan>(
  {
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Paid", "Overdue"],
    },
    amount: {
      type: Number,
      required: true,
    },
    receipt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Loan =
  (models.Loan as Model<ILoan>) || model<ILoan>("Loan", LoanSchema);
