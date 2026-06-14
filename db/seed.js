import db from "#db/client";
import { faker } from "@faker-js/faker";
import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser(faker.internet.username(), "password12345");


  for (let i = 0; i < 3; i++) {
  await createTask(faker.word.words(3), false, user1.id);
  }

}