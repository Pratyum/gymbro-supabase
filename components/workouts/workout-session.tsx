'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlayCircle, PauseCircle, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react'

interface Exercise {
  name: string
  sets: number
  reps: number
}

const exercises: Exercise[] = [
  { name: 'Push-ups', sets: 3, reps: 15 },
  { name: 'Squats', sets: 3, reps: 20 },
  { name: 'Lunges', sets: 3, reps: 12 },
  { name: 'Plank', sets: 3, reps: 30 },
  { name: 'Mountain Climbers', sets: 3, reps: 25 },
]

type WorkoutPageProps = {
  sessionId: number;
}

export default function WorkoutPage({sessionId}: WorkoutPageProps) {
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [actualReps, setActualReps] = useState<number[][]>(
    exercises.map(exercise => Array(exercise.sets).fill(0))
  )
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const startWorkout = () => {
    setIsWorkoutStarted(true)
    setIsTimerRunning(true)
  }

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetWorkout = () => {
    setIsWorkoutStarted(false)
    setCurrentExerciseIndex(0)
    setTimer(0)
    setIsTimerRunning(false)
    setActualReps(exercises.map(exercise => Array(exercise.sets).fill(0)))
  }

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setDirection(1)
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    } else {
      resetWorkout()
    }
  }

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setDirection(-1)
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const updateActualReps = (exerciseIndex: number, setIndex: number, value: number) => {
    const newActualReps = [...actualReps]
    newActualReps[exerciseIndex][setIndex] = value
    setActualReps(newActualReps)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const pageVariants = {
    initial: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 1000 : -1000
    }),
    in: {
      opacity: 1,
      x: 0
    },
    out: (direction: number) => ({
      opacity: 0,
      x: direction < 0 ? 1000 : -1000
    })
  }

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  }

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full rounded-lg overflow-hidden flex flex-col"
      >
        {!isWorkoutStarted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center p-8"
          >
            <h1 className="text-5xl font-bold text-primary mb-8">Workout Session</h1>
            <Button onClick={startWorkout} className="py-4 px-8 text-2xl rounded-full">
              Start Workout
            </Button>
          </motion.div>
        ) : (
          <>
          <div className="my-8 flex items-center gap-4 self-end">
                <div className="text-4xl font-bold text-accent-foreground">{formatTime(timer)}</div>
                <div>
                  <Button onClick={toggleTimer} variant="outline" className="mr-4 bg-gray-800 hover:bg-gray-700 text-white">
                    {isTimerRunning ? <PauseCircle size={24} /> : <PlayCircle size={24} />}
                  </Button>
                  <Button onClick={resetWorkout} variant="outline" className="bg-gray-800 hover:bg-gray-700 text-white">
                    <RotateCcw size={24} />
                  </Button>
                </div>
              </div>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentExerciseIndex}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={pageTransition}
              className="h-full flex flex-col p-8"
              >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold">{exercises[currentExerciseIndex].name}</h2>
              </div>
              <div className="flex-grow space-y-6 overflow-auto">
                {Array.from({ length: exercises[currentExerciseIndex].sets }).map((_, setIndex) => (
                  <motion.div
                  key={setIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: setIndex * 0.1 }}
                  className="flex items-center justify-between bg-slate-600 bg-opacity-30 p-4 rounded-lg"
                  >
                    <span className="text-xl font-medium text-accent-foreground">Set {setIndex + 1}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-lg text-accent-foreground">Expected: {exercises[currentExerciseIndex].reps}</span>
                      <Input
                        type="number"
                        value={actualReps[currentExerciseIndex][setIndex]}
                        onChange={(e) => updateActualReps(currentExerciseIndex, setIndex, parseInt(e.target.value) || 0)}
                        className="w-24 text-center bg-gray-800 text-white text-lg"
                        placeholder="Actual"
                        />
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <Button onClick={prevExercise} disabled={currentExerciseIndex === 0} className="text-xl py-3 px-6">
                  <ChevronLeft className="mr-2" size={24} />
                  Previous
                </Button>
                <Button onClick={nextExercise} className="text-xl py-3 px-6">
                  {currentExerciseIndex === exercises.length - 1 ? 'Finish' : 'Next'}
                  {currentExerciseIndex < exercises.length - 1 && <ChevronRight className="ml-2" size={24} />}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </> 
        )}
        {isWorkoutStarted && (
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
            className="h-2"
          />
        )}
      </motion.div>
    </div>
  )
}