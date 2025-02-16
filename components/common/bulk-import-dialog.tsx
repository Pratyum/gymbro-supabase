"use client";

import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

type BulkImportDialogProps = {
  triggerButtonComponent?: React.ReactNode;
  onImportSuccess?: (file: File) => void | Promise<void>;
  onImportError?: (error: Error) => void;
  dialogTitle?: string;
  dialogDescription?: string;
};
export function BulkImportDialog({
    triggerButtonComponent = (
        <Button variant="secondary">
            <Upload className="mr-2 h-4 w-4" />
      Bulk Import
        </Button>
    ),
    dialogTitle = "Bulk Import Members",
    dialogDescription = "Upload a CSV file to import multiple members at once.",
    onImportError,
    onImportSuccess,
}: BulkImportDialogProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCsvFile(e.target.files[0]);
        }
    };

    const handleBulkImport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (csvFile) {
            // Here you would typically send the file to your backend for processing
            console.log("Uploading file:", csvFile.name);

            if (onImportSuccess) {
                await onImportSuccess(csvFile);
            }
            toast({
                title: "CSV Upload Successful",
                description: `File "${csvFile.name}" has been uploaded for processing.`,
            });
            // Reset the file input
            setCsvFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } else {
            toast({
                title: "Error",
                description: "Please select a CSV file to upload.",
                variant: "destructive",
            });
            if (onImportError) {
                onImportError(new Error("No file selected"));
            }
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>{triggerButtonComponent}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleBulkImport}>
                    <div className="grid gap-4 py-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="csv-upload">CSV File</Label>
                            <Input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" variant="emerald">
              Upload and Import
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
