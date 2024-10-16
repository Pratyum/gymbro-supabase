
import dotenv from 'dotenv';
dotenv.config();

import { db } from '../utils/db/db';
import { exercisesTable, usersTable, workoutPlan, workoutPlanItem, workoutPlanItemSet, workoutSession, workoutSessionItemSetLog } from '../utils/db/schema';
import { faker } from '@faker-js/faker';

async function seed() {
  console.log('Seeding database...')

  // Seed users
  const users = []
  for (let i = 0; i < 10; i++) {
    const user = {
      name: faker.person.fullName(),
      phoneNumber: faker.phone.number(),
      email: faker.internet.email(),
      plan: faker.helpers.arrayElement(['free', 'premium', 'pro']),
      stripe_id: faker.string.alphanumeric(20),
    }
    const [insertedUser] = await db.insert(usersTable).values(user).returning()
    users.push(insertedUser)
  }
  console.log('Users seeded')

  // Seed exercises
  const exercises = []
  for (let i = 0; i < 50; i++) {
    const exercise = {
      name: faker.helpers.arrayElement(['Squat', 'Bench Press', 'Deadlift', 'Overhead Press', 'Barbell Row']),
      category: faker.helpers.arrayElement(['Strength', 'Cardio', 'Flexibility']),
      description: faker.lorem.sentence(),
      force: faker.helpers.arrayElement(['Push', 'Pull']),
      level: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
      equipment: faker.helpers.arrayElement(['Barbell', 'Dumbbell', 'Machine', 'Bodyweight']),
      mechanic: faker.helpers.arrayElement(['Compound', 'Isolation']),
      primaryMuscles: [faker.helpers.arrayElement(['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'])],
      secondaryMuscles: [faker.helpers.arrayElement(['Triceps', 'Biceps', 'Core', 'Glutes', 'Hamstrings'])],
      imageUrls: [faker.image.url()],
    }
    const [insertedExercise] = await db.insert(exercisesTable).values(exercise).returning()
    exercises.push(insertedExercise)
  }
  console.log('Exercises seeded')

  // Seed workout plans
  for (const user of users) {
    const [insertedPlan] = await db.insert(workoutPlan).values({
      userId: user.id,
      friendlyName: faker.lorem.words(3),
    }).returning()

    // Seed workout plan items
    for (let i = 0; i < faker.number.int({ min: 3, max: 7 }); i++) {
      const [insertedItem] = await db.insert(workoutPlanItem).values({
        workoutPlanId: insertedPlan.id,
        exerciseId: faker.helpers.arrayElement(exercises).id,
        name: faker.lorem.words(2),
        previewImageUrl: faker.image.url(),
      }).returning()

      // Seed workout plan item sets
      for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
        await db.insert(workoutPlanItemSet).values({
          workoutPlanItemId: insertedItem.id,
          weight: faker.number.int({ min: 5, max: 100 }).toString(),
          reps: faker.number.int({ min: 5, max: 15 }).toString(),
          rest: faker.number.int({ min: 30, max: 120 }).toString(),
        })
      }
    }
  }
  console.log('Workout plans seeded')

  // Seed workout sessions
  for (const user of users) {
    const userPlans = await db.query.workoutPlan.findMany({
      where: (plan, { eq }) => eq(plan.userId, user.id),
      with: {
        items: {
          with: {
            sets: true
          }
        }
      }
    })

    for (const plan of userPlans) {
      const [insertedSession] = await db.insert(workoutSession).values({
        userId: user.id,
        workoutPlanId: plan.id,
        completed: faker.helpers.arrayElement(['true', 'false']),
      }).returning()

      // Seed workout session item set logs
      for (const item of plan.items) {
        for (const set of item.sets) {
          await db.insert(workoutSessionItemSetLog).values({
            workoutSessionId: insertedSession.id,
            workoutPlanItemSetId: set.id,
            isCompleted: faker.helpers.arrayElement(['true', 'false']),
            actualReps: faker.number.int({ min: 1, max: 20 }).toString(),
            actualWeight: faker.number.int({ min: 5, max: 100 }).toString(),
            actualRest: faker.number.int({ min: 15, max: 180 }).toString(),
          })
        }
      }
    }
  }
  console.log('Workout sessions seeded')

  console.log('Database seeding completed')
}

seed().catch(console.error)