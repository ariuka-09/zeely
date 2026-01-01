"use client";

import type React from "react";
import { useState, useRef } from "react";
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
import { Plus, Loader2, X, Image as ImageIcon } from "lucide-react";
import { upload } from "@vercel/blob/client";

export function LoanForm({
  onCreateLoan,
}: {
  onCreateLoan: (loan: Loan) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for the file handling
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for the form fields
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    amount: "",
    phone: "",
    dueDate: "",
  });

  // 1. Local Preview Logic (No network request yet)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Generate a temporary local URL to show the user the image
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl); // Clean up memory
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 2. Submission Logic (Uploads to Blob, then creates Loan)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalReceiptUrl = "";

      // Only perform the Vercel Blob upload when the user submits
      if (selectedFile) {
        const newBlob = await upload(selectedFile.name, selectedFile, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        finalReceiptUrl = newBlob.url;
      }

      const newLoan: Loan = {
        _id: String(Math.random()),
        name: formData.name,
        company: formData.company,
        amount: Number.parseFloat(formData.amount),
        phoneNumber: formData.phone,
        dueDate: formData.dueDate,
        createdAt: new Date().toISOString().split("T")[0],
        status: "Pending",
        receipt: finalReceiptUrl, // The URL from Vercel is saved here
      };

      onCreateLoan(newLoan);

      // Reset everything after success
      setFormData({
        name: "",
        company: "",
        amount: "",
        phone: "",
        dueDate: "",
      });
      removeSelectedFile();
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Зээл бүртгэхэд алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
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
          {/* Name Field */}
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

          {/* Company Field */}
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

          {/* Amount Field */}
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

          {/* Phone Field */}
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

          {/* Due Date Field */}
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

          {/* Receipt Section */}
          <div className="space-y-2 border-t pt-4">
            <Label>Баримтын зураг</Label>

            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition border-slate-200"
              >
                <ImageIcon className="size-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">Зураг хавсаргах</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border bg-slate-100">
                <img
                  src={previewUrl}
                  alt="Receipt preview"
                  className="w-full h-full object-contain"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                  onClick={removeSelectedFile}
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Хадгалж байна...
              </>
            ) : (
              <>
                <Plus className="mr-2 size-4" />
                Зээл бүртгэх
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
