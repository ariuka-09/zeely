"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export function LoanFilters({
  onFilter,
  totalLoans,
}: {
  onFilter: (search: string, startDate: string, endDate: string) => void;
  totalLoans: number;
}) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterChange = (
    newSearch?: string,
    newStart?: string,
    newEnd?: string
  ) => {
    const searchValue = newSearch !== undefined ? newSearch : search;
    const startValue = newStart !== undefined ? newStart : startDate;
    const endValue = newEnd !== undefined ? newEnd : endDate;

    onFilter(searchValue, startValue, endValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Шүүлтүүр</CardTitle>
        <CardDescription>Нэр, дугаар болон хугацаагаар шүүх</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Хайх</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Нэр эсвэл утас..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleFilterChange(e.target.value);
              }}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Эхлэх огноо</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              handleFilterChange(undefined, e.target.value);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Дуусах огноо</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              handleFilterChange(undefined, undefined, e.target.value);
            }}
          />
        </div>

        <div className="rounded-lg border border-border bg-muted/50 p-3">
          <p className="text-sm text-muted-foreground">
            Нийт зээл:{" "}
            <span className="font-semibold text-foreground">{totalLoans}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
