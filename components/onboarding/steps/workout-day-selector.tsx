"use client";

import { motion } from "framer-motion";
import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DAYS_OF_WEEK } from "@/types";

interface WorkoutDaySelectorProps {
    selectedDays: number[];
    onDaysChange: (days: number[]) => void;
    title?: string;
    description?: string;
    showPresets?: boolean;
    className?: string;
}

const PRESET_SCHEDULES = [
    {
        name: "3-Day Split",
        days: [1, 3, 5], // Mon, Wed, Fri
        description: "Full body workouts",
    },
    {
        name: "4-Day Upper/Lower",
        days: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
        description: "Upper/Lower split",
    },
    {
        name: "5-Day Routine",
        days: [1, 2, 3, 4, 5], // Mon-Fri
        description: "Weekday training",
    },
    {
        name: "6-Day Push/Pull/Legs",
        days: [1, 2, 3, 4, 5, 6], // Mon-Sat
        description: "High frequency",
    },
];

export function WorkoutDaySelector({
    selectedDays,
    onDaysChange,
    title = "Workout Days",
    description = "Select which days to schedule workouts",
    showPresets = true,
    className = "",
}: WorkoutDaySelectorProps) {
    const handleDayToggle = (dayValue: number) => {
        const isSelected = selectedDays.includes(dayValue);
        const newDays = isSelected
            ? selectedDays.filter(day => day !== dayValue)
            : [...selectedDays, dayValue].sort();
        
        onDaysChange(newDays);
    };

    const handlePresetSelect = (presetDays: number[]) => {
        onDaysChange(presetDays);
    };

    const selectedCount = selectedDays.length;
    const restDays = 7 - selectedCount;

    return (
        <Card className={`border-2 border-green-200 bg-green-50 ${className}`}>
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-green-600" />
                    <div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground font-normal">
                            {description}
                        </p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Preset Schedules */}
                {showPresets && (
                    <div>
                        <Label className="text-sm font-medium mb-3 block">
                            Quick Presets
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                            {PRESET_SCHEDULES.map((preset) => {
                                const isActive = JSON.stringify(selectedDays) === JSON.stringify(preset.days);
                                return (
                                    <Button
                                        key={preset.name}
                                        variant={isActive ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePresetSelect(preset.days)}
                                        className="h-auto p-3 flex-col gap-1"
                                    >
                                        <div className="font-medium text-xs">{preset.name}</div>
                                        <div className="text-xs opacity-80">{preset.description}</div>
                                        <Badge variant="secondary" className="text-xs">
                                            {preset.days.length} days
                                        </Badge>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Individual Day Selection */}
                <div>
                    <Label className="text-sm font-medium mb-3 block">
                        Custom Schedule
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DAYS_OF_WEEK.map((day, index) => {
                            const isSelected = selectedDays.includes(day.value);
                            return (
                                <motion.div
                                    key={day.value}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className={`relative flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                                        isSelected 
                                            ? 'border-green-400 bg-green-200 shadow-md' 
                                            : 'border-gray-200 bg-background hover:border-green-200'
                                    }`}
                                    onClick={() => handleDayToggle(day.value)}
                                >
                                    <Checkbox
                                        id={`day-${day.value}`}
                                        checked={isSelected}
                                        onCheckedChange={() => handleDayToggle(day.value)}
                                        className="pointer-events-none"
                                    />
                                    <Label 
                                        htmlFor={`day-${day.value}`} 
                                        className="font-medium cursor-pointer flex-1"
                                    >
                                        <div className="font-semibold">{day.short}</div>
                                        <div className="text-xs text-muted-foreground hidden sm:block">
                                            {day.label}
                                        </div>
                                    </Label>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-green-600 text-white rounded-full p-1"
                                        >
                                            <Check className="h-3 w-3" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Schedule Summary */}
                {selectedCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-background rounded-lg border-2 border-green-300"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h4 className="font-semibold text-green-800">Schedule Summary</h4>
                                <p className="text-sm text-green-600">
                                    {selectedCount} workout days • {restDays} rest days
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="default" className="bg-green-600">
                                    {selectedCount} workout
                                </Badge>
                                <Badge variant="secondary">
                                    {restDays} rest
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                            {selectedDays.map(dayValue => {
                                const day = DAYS_OF_WEEK.find(d => d.value === dayValue);
                                return (
                                    <Badge 
                                        key={dayValue} 
                                        variant="outline" 
                                        className="text-xs border-green-400 text-green-700"
                                    >
                                        {day?.short}
                                    </Badge>
                                );
                            })}
                        </div>

                        {/* Weekly Pattern Visualization */}
                        <div className="mt-3 flex gap-1">
                            {DAYS_OF_WEEK.map((day) => (
                                <div
                                    key={day.value}
                                    className={`flex-1 h-2 rounded-sm ${
                                        selectedDays.includes(day.value)
                                            ? 'bg-green-500'
                                            : 'bg-gray-200'
                                    }`}
                                    title={`${day.label}: ${
                                        selectedDays.includes(day.value) ? 'Workout' : 'Rest'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>Sun</span>
                            <span>Sat</span>
                        </div>
                    </motion.div>
                )}

                {selectedCount === 0 && (
                    <div className="text-center p-6 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Select days to create a workout schedule</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}