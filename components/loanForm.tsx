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
      createdAt: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    onCreateLoan(newLoan);
    setFormData({ name: "", company: "", amount: "", phone: "", dueDate: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Шинэ зээл бүртгэх</CardTitle>
        <CardDescription>
          Шинээр олгосон зээлийн мэдээллийг энд оруулна уу
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Зээлдэгчийн нэр</Label>
            <Input
              id="name"
              placeholder="Жишээ: Бат-Эрдэнэ"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Байгууллага / Компани</Label>
            <Input
              id="company"
              placeholder="Компанийн нэр"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Зээлийн дүн (₮)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="500,000"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Утасны дугаар</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="88xxxxxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Төлөх эцсийн хугацаа</Label>
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

          <Button type="submit" className="w-full font-bold">
            <Plus className="mr-2 size-4" />
            Зээл бүртгэх
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
