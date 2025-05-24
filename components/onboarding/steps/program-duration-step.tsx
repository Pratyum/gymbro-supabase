"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addWeeks } from "date-fns";
import { cn } from "@/lib/utils";
import { StepProps } from "@/types";

export function ProgramDurationStep({ data, onUpdate, onNext, onPrev }: StepProps) {
    const handleProgramUpdate = (field: keyof typeof data.program, value: any) => {
        onUpdate({
            program: {
                ...data.program,
                [field]: value,
            },
        });
    };

    const canProceed = data.program.name.trim() !== "" && data.program.durationWeeks > 0;
    const endDate = addWeeks(data.program.startDate, data.program.durationWeeks);

    const durationOptions = [
        { weeks: 4, label: "1 Month", description: "Perfect for building habits" },
        { weeks: 8, label: "2 Months", description: "See significant progress" },
        { weeks: 12, label: "3 Months", description: "Complete transformation" },
        { weeks: 24, label: "6 Months", description: "Long-term commitment" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Program Details</h2>
                <p className="text-muted-foreground">
                    Set the duration and details for {data.client?.name}'s program
                </p>
            </div>

            <div className="grid gap-6">
                {/* Program Name */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card className="border-2 border-blue-200 bg-blue-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                                <div>
                                    <h3 className="text-lg font-semibold">Program Name</h3>
                                    <p className="text-sm text-muted-foreground font-normal">
                                        Give your training program a memorable name
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="program-name" className="text-sm font-medium">
                                Program Title
                            </Label>
                            <Input
                                id="program-name"
                                placeholder="e.g., Summer Fitness Challenge, Strength Building Program"
                                value={data.program.name}
                                onChange={(e) => handleProgramUpdate("name", e.target.value)}
                                className="mt-1"
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Program Duration */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card className="border-2 border-purple-200 bg-purple-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3">
                                <Clock className="h-6 w-6 text-purple-600" />
                                <div>
                                    <h3 className="text-lg font-semibold">Duration</h3>
                                    <p className="text-sm text-muted-foreground font-normal">
                                        How long will this program run?
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {durationOptions.map((option) => (
                                    <Button
                                        key={option.weeks}
                                        variant={data.program.durationWeeks === option.weeks ? "default" : "outline"}
                                        className="h-auto p-4 flex-col gap-1"
                                        onClick={() => handleProgramUpdate("durationWeeks", option.weeks)}
                                    >
                                        <div className="font-semibold">{option.label}</div>
                                        <div className="text-xs opacity-80">{option.description}</div>
                                        <div className="text-xs">{option.weeks} weeks</div>
                                    </Button>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <Label htmlFor="custom-weeks" className="text-sm font-medium">
                                    Custom Duration:
                                </Label>
                                <Input
                                    id="custom-weeks"
                                    type="number"
                                    min={1}
                                    max={52}
                                    value={data.program.durationWeeks}
                                    onChange={(e) => handleProgramUpdate("durationWeeks", parseInt(e.target.value) || 1)}
                                    className="w-20 text-center"
                                />
                                <span className="text-sm text-muted-foreground">weeks</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Start Date */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-green-600" />
                                <div>
                                    <h3 className="text-lg font-semibold">Start Date</h3>
                                    <p className="text-sm text-muted-foreground font-normal">
                                        When should the program begin?
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium">Program Start:</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "justify-start text-left font-normal",
                                                !data.program.startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {data.program.startDate ? format(data.program.startDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <CalendarComponent
                                            mode="single"
                                            selected={data.program.startDate}
                                            onSelect={(date) => handleProgramUpdate("startDate", date || new Date())}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            
                            {data.program.durationWeeks > 0 && (
                                <div className="p-3 bg-background rounded-lg">
                                    <div className="text-sm space-y-1">
                                        <div><strong>Program Duration:</strong> {data.program.durationWeeks} weeks</div>
                                        <div><strong>End Date:</strong> {format(endDate, "PPP")}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">
                                Description (Optional)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Add any additional notes or goals for this program..."
                                value={data.program.description || ""}
                                onChange={(e) => handleProgramUpdate("description", e.target.value)}
                                rows={3}
                            />
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onPrev}>
                    Previous
                </Button>
                <Button 
                    onClick={onNext} 
                    disabled={!canProceed}
                    className="gap-2"
                >
                    Review Program
                </Button>
            </div>
        </motion.div>
    );
}