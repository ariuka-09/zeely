"use client";

import { LoanCard } from "@/components/loanCard";
import { LoanFilters } from "@/components/loanFilters";
import { LoanForm } from "@/components/loanForm";
import { Loan } from "@/types/loan";
import { axiosInstance } from "@/utils/helpers";
import { useEffect, useState, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function LoanTrackerPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);

  const getToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  };

  const sortLoans = (loanList: Loan[]) => {
    const today = getToday();
    return [...loanList].sort((a, b) => {
      const isOverdue = (l: Loan) =>
        l.status !== "Paid" && new Date(l.dueDate).getTime() < today;
      const aOverdue = isOverdue(a);
      const bOverdue = isOverdue(b);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      if (a.status === "Paid" && b.status !== "Paid") return 1;
      if (a.status !== "Paid" && b.status === "Paid") return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const stats = useMemo(() => {
    const today = getToday();
    return loans.reduce(
      (acc, loan) => {
        const isOverdue =
          loan.status !== "Paid" && new Date(loan.dueDate).getTime() < today;
        if (loan.status === "Paid") acc.paid++;
        else if (isOverdue) acc.overdue++;
        else acc.pending++;
        return acc;
      },
      { paid: 0, pending: 0, overdue: 0 }
    );
  }, [loans]);

  const handleDeletePaidLoans = async () => {
    const paidLoanIds = loans
      .filter((l) => l.status === "Paid")
      .map((l) => l._id);

    const remainingLoans = loans.filter((l) => l.status !== "Paid");
    setLoans(remainingLoans);
    setFilteredLoans(remainingLoans);

    try {
      await Promise.all(
        paidLoanIds.map((id) => axiosInstance.delete(`/loan?id=${id}`))
      );
    } catch (error) {
      console.error("Төлөгдсөн зээлүүдийг устгахад алдаа гарлаа", error);
    }
  };

  const handleCreateLoan = async (loan: Loan) => {
    const response = await axiosInstance.post("/loan", loan);
    const updated = sortLoans([response.data, ...loans]);
    setLoans(updated);
    setFilteredLoans(updated);
  };

  const handleUpdateLoan = (updatedLoan: Loan) => {
    const updated = loans.map((loan) =>
      loan._id === updatedLoan._id ? updatedLoan : loan
    );
    const sorted = sortLoans(updated);
    setLoans(sorted);
    setFilteredLoans(
      sorted.filter((loan) => filteredLoans.some((fl) => fl._id === loan._id))
    );
    axiosInstance.patch(`/loan?id=${updatedLoan._id}`, updatedLoan);
  };

  const handleDeleteLoan = async (id: string) => {
    const updated = loans.filter((loan) => loan._id !== id);
    setLoans(updated);
    setFilteredLoans(
      updated.filter((loan) => filteredLoans.some((fl) => fl._id === loan._id))
    );
    await axiosInstance.delete(`/loan?id=${id}`);
  };

  const handleFilter = (
    searchTerm: string,
    startDate: string,
    endDate: string
  ) => {
    let filtered = [...loans];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.name.toLowerCase().includes(term) ||
          loan.phoneNumber.includes(term) ||
          (loan.company && loan.company.toLowerCase().includes(term))
      );
    }
    if (startDate && endDate) {
      filtered = filtered.filter((loan) => {
        const loanDate = new Date(
          new Date(loan.dueDate).toISOString().split("T")[0]
        );
        return loanDate >= new Date(startDate) && loanDate <= new Date(endDate);
      });
    }
    setFilteredLoans(sortLoans(filtered));
  };

  useEffect(() => {
    const getLoans = async () => {
      const response = await axiosInstance.get("/loan");
      const sorted = sortLoans(response.data);
      setLoans(sorted);
      setFilteredLoans(sorted);
    };
    getLoans();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Зээлийн бүртгэл
            </h1>
            <p className="text-muted-foreground font-medium italic">
              Хяналтын самбар
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div className="flex flex-col border-l-4 border-slate-300 pl-4">
                <span className="text-[10px] font-black text-muted-foreground uppercase">
                  Хүлээгдэж буй
                </span>
                <span className="text-2xl font-black">{stats.pending}</span>
              </div>
              <div className="flex flex-col border-l-4 border-green-600 pl-4">
                <span className="text-[10px] font-black text-green-600 uppercase">
                  Төлөгдсөн
                </span>
                <span className="text-2xl font-black text-green-600">
                  {stats.paid}
                </span>
              </div>
              <div
                className={`flex flex-col border-l-4 border-red-600 pl-4 ${
                  stats.overdue > 0 ? "animate-pulse" : ""
                }`}
              >
                <span className="text-[10px] font-black text-red-600 uppercase">
                  Хугацаа хэтэрсэн
                </span>
                <span className="text-2xl font-black text-red-600">
                  {stats.overdue}
                </span>
              </div>
            </div>

            {stats.paid > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="font-bold flex gap-2"
                  >
                    <Trash2 className="size-4" /> Төлөгдсөнийг цэвэрлэх
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Нийт {stats.paid} төлөгдсөн зээлийг устгах уу?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Одоогоор <strong>Төлөгдсөн</strong> төлөвтэй байгаа бүх
                      зээлийг системээс бүрмөсөн устгах болно. Энэ үйлдлийг
                      буцаах боломжгүй.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Болих</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeletePaidLoans}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Тийм, бүгдийг устгах
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <LoanForm onCreateLoan={handleCreateLoan} />
            <LoanFilters onFilter={handleFilter} totalLoans={loans.length} />
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Идэвхтэй зээлүүд ({filteredLoans.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredLoans.map((loan) => (
                <LoanCard
                  key={loan._id}
                  loan={loan}
                  onUpdate={handleUpdateLoan}
                  onDelete={handleDeleteLoan}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
