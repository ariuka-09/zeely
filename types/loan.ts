export interface Loan {
  _id?: string;
  name: string;
  company: string;
  amount: number;
  phoneNumber: string;
  dueDate: string;
  dateTaken: string;
  status: "active" | "paid";
}
