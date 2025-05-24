"use client";

import { motion } from "framer-motion";
import { User, Target, Droplets, Moon, Calendar, Clock, Dumbbell, Coffee, CheckCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, addWeeks } from "date-fns";
import { StepProps, DAYS_OF_WEEK } from "@/types";

export function ReviewStep({ data, onUpdate, onNext, onPrev }: StepProps) {
    const endDate = addWeeks(data.program.startDate, data.program.durationWeeks);
    
    const workoutDays = Object.values(data.weeklySchedule).filter(day => day.type === 'workout').length;
    const restDays = 7 - workoutDays;

    const mockWorkoutPlans = [
        { id: 1, friendlyName: "Upper Body Strength" },
        { id: 2, friendlyName: "Lower Body Power" },
        { id: 3, friendlyName: "Full Body Circuit" },
        { id: 4, friendlyName: "Cardio Blast" },
        { id: 5, friendlyName: "Core & Flexibility" },
    ];

    const getWorkoutPlanName = (id?: number) => {
        return mockWorkoutPlans.find(plan => plan.id === id)?.friendlyName || "Unknown Plan";
    };

    const handleEdit = (step: number) => {
        onUpdate({ step });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Review & Create Program</h2>
                <p className="text-muted-foreground">
                    Review all the details before creating the training program
                </p>
            </div>

            <div className="grid gap-6">
                {/* Client Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <User className="h-6 w-6 text-blue-600" />
                                    <span>Client Information</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEdit(0)}
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div><strong>Name:</strong> {data.client?.name}</div>
                                {data.client?.email && <div><strong>Email:</strong> {data.client.email}</div>}
                                <div><strong>Phone:</strong> {data.client?.phoneNumber}</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Daily Goals */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Target className="h-6 w-6 text-purple-600" />
                                    <span>Daily Goals</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEdit(1)}
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                                    <div className="font-semibold text-blue-600">{data.goals.stepsGoal.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Steps</div>
                                </div>
                                <div className="text-center p-3 bg-cyan-50 rounded-lg">
                                    <Droplets className="h-6 w-6 text-cyan-600 mx-auto mb-2" />
                                    <div className="font-semibold text-cyan-600">{data.goals.waterGoal}</div>
                                    <div className="text-sm text-muted-foreground">Glasses</div>
                                </div>
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <Moon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                    <div className="font-semibold text-purple-600">{data.goals.sleepGoal}h</div>
                                    <div className="text-sm text-muted-foreground">Sleep</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Weekly Schedule */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                    <span>Weekly Schedule</span>
                                    <Badge variant="secondary">
                                        {workoutDays} Workout · {restDays} Rest
                                    </Badge>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEdit(2)}
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {DAYS_OF_WEEK.map((day) => {
                                    const schedule = data.weeklySchedule[day.value];
                                    return (
                                        <div key={day.value} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium">{day.label}</span>
                                                <Badge variant={schedule?.type === 'workout' ? 'default' : 'secondary'}>
                                                    {schedule?.type === 'workout' ? (
                                                        <><Dumbbell className="h-3 w-3 mr-1" /> Workout</>
                                                    ) : (
                                                        <><Coffee className="h-3 w-3 mr-1" /> Rest</>
                                                    )}
                                                </Badge>
                                            </div>
                                            {schedule?.type === 'workout' && schedule.workoutPlanId && (
                                                <div className="text-sm text-muted-foreground">
                                                    {getWorkoutPlanName(schedule.workoutPlanId)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Program Details */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                >
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                    <span>Program Details</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => handleEdit(3)}
                                    className="gap-2"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <strong>Program Name:</strong> {data.program.name}
                            </div>
                            {data.program.description && (
                                <div>
                                    <strong>Description:</strong> {data.program.description}
                                </div>
                            )}
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <strong>Duration:</strong> {data.program.durationWeeks} weeks
                                </div>
                                <div>
                                    <strong>Start Date:</strong> {format(data.program.startDate, "PPP")}
                                </div>
                                <div>
                                    <strong>End Date:</strong> {format(endDate, "PPP")}
                                </div>
                            </div>
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
                    className="gap-2 bg-green-600 hover:bg-green-700"
                >
                    <CheckCircle className="h-4 w-4" />
                    Create Program
                </Button>
            </div>
        </motion.div>
    );
}