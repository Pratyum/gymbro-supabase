'use server';
import { db } from "@/utils/db/db";
import { exercisesTable, SelectExercise } from "@/utils/db/schema";
import { eq, ilike, or } from "drizzle-orm";

export async function searchExercises(query: string , limit=10){
  try{
    const exercises = await db.select().from(exercisesTable)
    .where(or(
        ilike(exercisesTable.name, `%${query}%`),
        ilike(exercisesTable.equipment, `%${query}%`),
        ilike(exercisesTable.mechanic, `%${query}%`),
    ))
    .orderBy(exercisesTable.name, exercisesTable.equipment, exercisesTable.mechanic)
    .limit(limit);
    return {success: true, data: exercises as SelectExercise[]};
  }catch(error){
    console.error('Failed to search exercises:', error);
    return {success: false};
  } 
}

export async function getExerciseById(id: number){
  try{
    const exercise = await db.select().from(exercisesTable).where(eq(exercisesTable.id, id));
    return {success: true, data: exercise[0] as SelectExercise};
  }catch(error){
    console.error('Failed to get exercise by id:', error);
    return {success: false};
  }
} 

export async function getExercises(){
  try{
    const exercises = await db.select().from(exercisesTable);
    return {success: true, data: exercises as SelectExercise[]};
  }catch(error){
    console.error('Failed to get exercises:', error);
    return {success: false};
  }
}

