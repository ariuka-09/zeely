export interface Loan {
  _id?: string;
  name: string;
  company: string;
  amount: number;
  phoneNumber: string;
  dueDate: string;
  createdAt: string;
  receipt: string;
  status: "Pending" | "Paid" | "Overdue";
}
