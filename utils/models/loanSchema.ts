import mongoose, { Schema, model, models, Model } from "mongoose";

interface ILoan {
  name: string;
  companyName: string;
  phoneNumber: string;
  payBackDate: Date;
  amount: number;
  status: string;
}

const LoanSchema: Schema = new Schema(
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

export const Loan = (models.Loan as Model<ILoan>) || model("Loan", LoanSchema);
