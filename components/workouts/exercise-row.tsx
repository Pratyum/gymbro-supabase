import { Input } from "../ui/input";


const ActualVsExpected = ({emoji, expected, actual, onChange}:{emoji: string, expected: number, actual: number, onChange: (value: number) => void}) => {
    return (
        <div className="flex items-center space-x-4">
            <span className="text-xl font-medium text-accent-foreground">
                {emoji}
            </span>
            <Input
                type="number"
                placeholder={`${expected}`}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="max-w-16"
            />
            <span className="text-xl font-medium text-accent-foreground">
            /{expected}
            </span>
        </div>
    );
};

export const ExerciseRow = ({setIndex , expectedWeight, actualWeight, expectedReps, actualReps , updateActualReps, updateActualWeight}:{
    setIndex: number;
    expectedWeight: number;
    actualWeight: number;
    expectedReps: number;
    actualReps: number;
    updateActualReps: (setIndex: number, value: number) => void;
    updateActualWeight: (setIndex: number, value: number) => void;
}) => {
    return (<>
        <span className="text-xl font-medium text-accent-foreground">
                        Set {setIndex + 1}
        </span>
        <div className="flex items-center space-x-4">
            <ActualVsExpected 
                emoji="💪"
                expected={expectedWeight} 
                actual={actualWeight} 
                onChange={(value) => updateActualWeight(setIndex, value)} 
            />
            <ActualVsExpected
                emoji="🔁"
                expected={expectedReps} 
                actual={actualReps} 
                onChange={(value) => updateActualReps(setIndex, value)} 
            />
        </div>
    </>)
}