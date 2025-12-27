"use client";

import { LoanCard } from "@/components/loanCard";
import { LoanFilters } from "@/components/loanFilters";
import { LoanForm } from "@/components/loanForm";
import { Loan } from "@/types/loan";
import { axiosInstance } from "@/utils/helpers";
import { useEffect, useState } from "react";

export default function LoanTrackerPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);

  const handleCreateLoan = async (loan: Loan) => {
    console.log("loan being created", loan);

    const newLoans = [loan, ...loans];
    setLoans(newLoans);
    setFilteredLoans(newLoans);
    const newLoan = await axiosInstance.post("/loan", loan);
    console.log("new loan", newLoan);
  };

  const handleUpdateLoan = (updatedLoan: Loan) => {
    const newLoans = loans.map((loan) =>
      loan._id === updatedLoan._id ? updatedLoan : loan
    );
    setLoans(newLoans);
    setFilteredLoans(
      newLoans.filter((loan) => filteredLoans.some((fl) => fl._id === loan._id))
    );
    const changedLoan = axiosInstance.patch(
      `/loan?id=${updatedLoan._id}`,
      updatedLoan
    );
    console.log("updated loan", changedLoan);
  };

  const handleDeleteLoan = async (id: string) => {
    const newLoans = loans.filter((loan) => loan._id !== id);
    setLoans(newLoans);
    setFilteredLoans(
      newLoans.filter((loan) => filteredLoans.some((fl) => fl._id === loan._id))
    );
    const deletedLoan = await axiosInstance.delete(`/loan?id=${id}`);
    console.log("deleted loan", deletedLoan);
  };

  const handleFilter = (
    searchTerm: string,
    startDate: string,
    endDate: string
  ) => {
    let filtered = loans;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (loan) =>
          loan.name.toLowerCase().includes(term) ||
          loan.phoneNumber.includes(term)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((loan) => {
        const loanDate = new Date(loan.dateTaken);
        return loanDate >= new Date(startDate) && loanDate <= new Date(endDate);
      });
    }

    setFilteredLoans(filtered);
  };

  const getLoans = async () => {
    const loans = await axiosInstance.get("/loan");
    console.log("loans", loans);
    setLoans(loans.data);
    setFilteredLoans(loans.data);
  };
  useEffect(() => {
    getLoans();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Loan Tracker
          </h1>
          <p className="text-muted-foreground">
            Manage and track all your loans in one place
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <LoanForm onCreateLoan={handleCreateLoan} />
            <LoanFilters onFilter={handleFilter} totalLoans={loans.length} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Active Loans ({filteredLoans.length})
              </h2>
            </div>

            {filteredLoans.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
                <p className="text-muted-foreground">
                  No loans found. Create your first loan to get started.
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
