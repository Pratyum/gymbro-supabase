"use client";

import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import LazyLoadingSupabaseImage from "./common/lazy-loading-supabase-image";
import { useQuery } from "@tanstack/react-query";
import { Exercise } from "@/types";

type ExerciseSelectProps = {
  exercise: Exercise | undefined;
  onExerciseChange: (exercise: Exercise) => void;
};

export default function ExerciseSelect({
  exercise,
  onExerciseChange,
}: ExerciseSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isPending } = useQuery({
    queryKey: ["searchExercises", searchQuery],
    queryFn: async () => {
      const response = await fetch(
        `/api/exercise/search?query=${searchQuery}`,
        {
          credentials: "include",
        },
      );
      const data = (await response.json()).data;
      return data as Exercise[];
    },
  });

  return (
    <Select
      value={String(exercise?.id)}
      onValueChange={(value) => {
        const selectedExercise = searchResults?.find(
          (result) => String(result?.id) === value,
        );
        if (selectedExercise) {
          onExerciseChange(selectedExercise);
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an exercise" />
      </SelectTrigger>
      <SelectContent>
        <Input
          placeholder="Search exercises..."
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        {isPending && <div>Loading...</div>}
        {exercise && (
          <SelectItem value={String(exercise?.id)}>
            <div className="flex items-center">
              {exercise?.imageUrls?.length && (
                <LazyLoadingSupabaseImage
                  fullPath={exercise.imageUrls[0]}
                  className="w-10 h-10 mr-2"
                  alt={exercise.name}
                  height={40}
                  width={40}
                />
              )}
              {exercise.name}
            </div>
          </SelectItem>
        )}
        {searchResults
          ?.filter((item) => item.id !== exercise?.id)
          .map((result) => (
            <SelectItem key={result.id} value={String(result.id)}>
              <div className="flex items-center">
                {result?.imageUrls?.length && (
                  <LazyLoadingSupabaseImage
                    fullPath={result.imageUrls[0]}
                    className="w-10 h-10 mr-2"
                    alt={result.name}
                    height={40}
                    width={40}
                  />
                )}
                {result.name}
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
