'use client';
import { useEffect, useState } from "react";

export const useTimer = () => {
    const [timer, setTimer] = useState(0);
    const [isTimerRunning , setIsTimerRunning] = useState(false);


    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const toggleTimer = () => {
        setIsTimerRunning((prev) => !prev);
    }

    const resetTimer = () => {
        setTimer(0);
        setIsTimerRunning(false);
    }
    return { timer, toggleTimer, resetTimer };
}