"use client";

import { CalendarIcon, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useFormState, useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { addWeightLog } from "@/actions/weight-log";

export function AddWeightForm({
  action,
}: {
  action: (
    state: { message: string },
    formData: FormData
  ) => Promise<{ message: string }>;
}) {
  const [date, setDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState<string>("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
    }
  };

  const initialState = {
    message: "",
  };

  const [formState, formAction] = useFormState(action, initialState);
  const { pending } = useFormStatus();
  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => setDate(date ?? new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <input type="hidden" name="date" value={date.toISOString()} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            name="weight"
            type="number"
            step="0.1"
            placeholder="Enter your weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="photo">Upload Photo (optional)</Label>
        <Input
          name="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending && (
          <>
            <FaSpinner className="animate-spin mr-2" /> Loading
          </>
        )}
        {!pending && (
          <>
            <Plus className="mr-2 h-4 w-4" /> Add Weight Log
          </>
        )}
      </Button>
      {formState?.message && (
        <p className="text-sm text-red-500 text-center py-2">
          {formState.message}
        </p>
      )}
    </form>
  );
}

export function AddWeightDialog({ open= false }: { open?: boolean }) {
  const [isOpen, setIsOpen] = useState(open);

  const action = async (state: { message: string }, formData: FormData) => {
    const response = await addWeightLog(state, formData);
    if (!response.message) {
      setIsOpen(false);
    }
    return { message: response.message };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Weight Log</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Weight Log</DialogTitle>
          <DialogDescription>
            Add your weight log to track your progress
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AddWeightForm action={action} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
