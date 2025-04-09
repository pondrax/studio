import { hash, verify } from '@node-rs/argon2';
import { db, schema, t } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

const loginSchema = z.object({
  identity: z.string().min(1, 'Identity is required'),
  password: z.string().min(8, 'Password is required'),
});

export async function POST({ params, request }) {
  try {
    const form = await request.json();
    const { identity, password } = loginSchema.parse(form);

    const collectionName = params.name as keyof typeof schema;
    // console.log(schema[collectionName])
    const results = await db
      .select()
      // @ts-ignore
      .from(schema[collectionName])
      .where(
        t.or(
          // @ts-ignore
          t.eq(schema[collectionName].username, identity), t.eq(schema[collectionName].email, identity)
        ));

    const existingUser = results.at(0);
    if (!existingUser) {
      throw error(400, { message: 'User not exists' });
    }

    // @ts-ignore
    const validPassword = await verify(existingUser.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      throw error(400, { message: 'Incorrect email or password' });
    }

    return json({

    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(400, { message: err.errors.map((e) => e.message).join(', ') });
    }
    throw err;
  }
}
