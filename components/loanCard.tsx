"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Loan } from "@/types/loan";
import {
  Building2,
  Calendar,
  Phone,
  DollarSign,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
} from "lucide-react";

export function LoanCard({
  loan,
  onUpdate,
  onDelete,
}: {
  loan: Loan;
  onUpdate: (loan: Loan) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(loan);

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const toggleStatus = () => {
    onUpdate({ ...loan, status: loan.status === "active" ? "paid" : "active" });
  };

  return (
    <Card
      className={`${
        loan.status === "paid"
          ? "border-success bg-success/5"
          : "border-warning bg-warning/5"
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          {isEditing ? (
            <Input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="h-8 text-lg font-semibold"
            />
          ) : (
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {loan.name}
            </h3>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="size-3" />
            {isEditing ? (
              <Input
                value={editData.company}
                onChange={(e) =>
                  setEditData({ ...editData, company: e.target.value })
                }
                className="h-6 text-sm"
              />
            ) : (
              <span>{loan.company}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={loan.status === "paid" ? "default" : "secondary"}
            className={
              loan.status === "paid"
                ? "bg-success text-success-foreground"
                : "bg-warning text-warning-foreground"
            }
          >
            {loan.status === "paid" ? "Paid" : "Active"}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                <Pencil className="mr-2 size-4" />
                {isEditing ? "Cancel" : "Edit"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleStatus}>
                <Check className="mr-2 size-4" />
                Mark as {loan.status === "paid" ? "Active" : "Paid"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(loan._id as string)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="size-4" />
            <span>Amount</span>
          </div>
          {isEditing ? (
            <Input
              type="number"
              value={editData.amount}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  amount: Number.parseFloat(e.target.value),
                })
              }
              className="h-8 w-32 text-right"
            />
          ) : (
            <span className="text-xl font-bold">
              ${loan.amount.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4" />
            <span>Phone</span>
          </div>
          {isEditing ? (
            <Input
              value={editData.phoneNumber}
              onChange={(e) =>
                setEditData({ ...editData, phoneNumber: e.target.value })
              }
              className="h-8 w-40 text-right"
            />
          ) : (
            <span className="font-mono">{loan.phoneNumber}</span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>Due Date</span>
          </div>
          {isEditing ? (
            <Input
              type="date"
              value={editData.dueDate}
              onChange={(e) =>
                setEditData({ ...editData, dueDate: e.target.value })
              }
              className="h-8 w-40"
            />
          ) : (
            <span className="font-medium">
              {new Date(loan.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
      {isEditing && (
        <CardFooter>
          <Button onClick={handleSave} className="w-full">
            Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
