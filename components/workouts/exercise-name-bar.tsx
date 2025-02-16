import { SelectExercise } from "@/utils/db/schema";
import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { ResponsiveDrawer } from "../common/responsive-drawer";
import LazyLoadingSupabaseImage from "../common/lazy-loading-supabase-image";

export const ExerciseNameBar = ({exercise}: {exercise: SelectExercise}) => {
    const [open, setOpen] = useState(false);

    if(!exercise) return null;
    
    const {name , imageUrls,} = exercise;
    return (
        <>
            <div className="text-center mb-8 flex items-center gap-2">
                <h2 className="text-4xl font-bold">
                    {name}
                </h2>
                <InfoIcon 
                    onClick={() => setOpen(prev => !prev)} 
                    className="text-accent-foreground"
                    size={24} 
                />
            </div>
            <ResponsiveDrawer title={name} open={open} setOpen={setOpen}>
                <div className="p-4 flex flex-col gap-4 items-center">
                    {imageUrls.map((url) => (
                        <LazyLoadingSupabaseImage
                            key={url}
                            fullPath={url}
                            width={400}
                            height={275}
                            alt={name}
                            className="rounded-lg shadow-md"
                        />
                    ))}
                </div>
            </ResponsiveDrawer>
        </>
    )
}