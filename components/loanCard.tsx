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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  const statusConfig = {
    Paid: {
      styles:
        "border-l-[8px] border-green-600 bg-green-50 dark:bg-green-950/30",
      icon: "text-green-600",
      label: "ТӨЛӨГДСӨН",
    },
    Pending: {
      styles:
        "border-l-[8px] border-slate-400 bg-slate-50 dark:bg-slate-900/50",
      icon: "text-slate-500",
      label: "ХҮЛЭЭГДЭЖ БУЙ",
    },
    Overdue: {
      styles: "border-l-[8px] border-red-600 bg-red-50 dark:bg-red-950/30",
      icon: "text-red-600",
      label: "ХЭТЭРСЭН",
    },
  };

  const now = new Date();
  const todayAtMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const isOverdue =
    loan.status !== "Paid" &&
    new Date(loan.dueDate).getTime() < todayAtMidnight.getTime();

  const activeStatus = isOverdue ? "Overdue" : loan.status;

  // Logic for the badge label in Mongolian
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Paid":
        return "Төлөгдсөн";
      case "Overdue":
        return "Хугацаа хэтэрсэн";
      default:
        return "Хугацаа хэтэрсэн";
    }
  };

  const currentStyles =
    statusConfig[activeStatus as keyof typeof statusConfig] ||
    statusConfig.Pending;

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const toggleStatus = () => {
    onUpdate({
      ...loan,
      status: loan.status === "Pending" ? "Paid" : "Pending",
    });
  };

  return (
    <Card
      className={`relative transition-all border-2 ${currentStyles.styles}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <span
            className={`text-[10px] font-black tracking-widest ${currentStyles.icon}`}
          >
            {currentStyles.label}
          </span>
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
            className={`font-bold ${
              activeStatus === "Paid"
                ? "bg-green-600"
                : activeStatus === "Overdue"
                ? "bg-red-600"
                : "bg-slate-500"
            }`}
          >
            {getStatusLabel(activeStatus)}
          </Badge>

          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(!isEditing)}>
                  <Pencil className="mr-2 size-4" />
                  {isEditing ? "Цуцлах" : "Засах"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleStatus}>
                  <Check className="mr-2 size-4" />
                  {loan.status === "Paid"
                    ? "Pending болгох"
                    : "Төлөгдсөн болгох"}
                </DropdownMenuItem>

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
                    <Trash2 className="mr-2 size-4" />
                    Устгах
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Та итгэлтэй байна уу?</AlertDialogTitle>
                <AlertDialogDescription>
                  <strong>{loan.name}</strong>-ийн зээлийн бүртгэлийг бүрмөсөн
                  устгах гэж байна. Энэ үйлдлийг буцаах боломжгүй.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Болих</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(loan._id as string)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Устгах
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="size-4" />
            <span>Дүн</span>
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
            <span
              className={`text-xl font-black ${
                isOverdue ? "text-red-600" : ""
              }`}
            >
              ₮{loan.amount.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4" />
            <span>Утас</span>
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
            <span className="font-mono font-bold">{loan.phoneNumber}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>Дуусах хугацаа</span>
          </div>
          {isEditing ? (
            <Input
              type="date"
              value={
                typeof editData.dueDate === "string"
                  ? editData.dueDate
                  : new Date(editData.dueDate).toISOString().split("T")[0]
              }
              onChange={(e) =>
                setEditData({ ...editData, dueDate: e.target.value })
              }
              className="h-8 w-40"
            />
          ) : (
            <span className={`font-bold ${isOverdue ? "text-red-600" : ""}`}>
              {new Date(loan.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>

      {isEditing && (
        <CardFooter>
          <Button onClick={handleSave} className="w-full font-bold">
            Өөрчлөлтийг хадгалах
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
