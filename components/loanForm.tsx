"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Loan } from "@/types/loan";
import { Plus } from "lucide-react";

export function LoanForm({
  onCreateLoan,
}: {
  onCreateLoan: (loan: Loan) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    amount: "",
    phone: "",
    dueDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLoan: Loan = {
      _id: String(Math.random()),
      name: formData.name,
      company: formData.company,
      amount: Number.parseFloat(formData.amount),
      phoneNumber: formData.phone,
      dueDate: formData.dueDate,
      dateTaken: new Date().toISOString().split("T")[0],
      status: "active",
    };

    onCreateLoan(newLoan);
    setFormData({ name: "", company: "", amount: "", phone: "", dueDate: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Loan</CardTitle>
        <CardDescription>Add a new loan entry to track</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Acme Corp"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="5000"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit" className="w-full">
            <Plus className="mr-2 size-4" />
            Create Loan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
