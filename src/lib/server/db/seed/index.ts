import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema/app";
import roles from "./roles";
import { eq, sql } from "drizzle-orm";
import users from "./users";
import questionsCategory from "./questionsCategory";
import questions from "./questions";
import companies from "./companies";

function updateSets(values: Record<string, any>[]) {
  return Object.assign(
    {},
    ...Object.keys(values[0])
      .filter((k) => k !== "id")
      .map((k) => {
        return ({ [k]: sql.raw(`excluded.${k}`) })
      }),
  )
}


const main = async () => {
  const connection = postgres(process.env.DATABASE_URL as string);
  const db = drizzle(connection);

  await db.insert(schema.roles).values(roles)
    .onConflictDoUpdate({
      target: schema.roles.id,
      set: updateSets(roles),
    })
  console.log('Roles seeded');

  await db.insert(schema.companies).values(companies)
    .onConflictDoUpdate({
      target: schema.companies.id,
      set: updateSets(roles),
    })
  console.log('Companies seeded');

  await db.insert(schema.users).values(users)
    .onConflictDoUpdate({
      target: schema.users.id,
      set: updateSets(users),
    })
  console.log('Users seeded');

  await db.insert(schema.questionsCategory).values(questionsCategory)
    .onConflictDoUpdate({
      target: schema.questionsCategory.id,
      set: updateSets(questionsCategory),
    })
  console.log('Questions Category seeded');

  await db.insert(schema.questions).values(questions)
    .onConflictDoUpdate({
      target: schema.questions.id,
      set: updateSets(questions),
    })
  console.log('Questions seeded');


};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });
