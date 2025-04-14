import { hash, verify } from '@node-rs/argon2';
import { db, schema, t } from '$lib/server/db';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { createId, d } from '$lib/app/index.js';
import { Session } from '$lib/server/auth/session.js';

const loginSchema = z.object({
  identity: z.string().min(1, 'Identity is required'),
  password: z.string().min(8, 'Password is required'),
});

export async function POST({ params, request, cookies }) {
  try {
    const form = await request.json();
    const { identity, password } = loginSchema.parse(form);

    const collectionName = params.name as keyof typeof schema;
    // @ts-ignore
    const existingUser = await db.query[collectionName].findFirst({
      where:
        t.or(
          // @ts-ignore
          t.eq(schema[collectionName].username, identity), t.eq(schema[collectionName].email, identity)
        )
    });

    if (!existingUser) {
      throw error(400, { message: 'User not exists' });
    }

    const validPassword = await verify(existingUser.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      throw error(400, { message: 'Incorrect email or password' });
    }

    const sessionId = await Session.create({
      userId: existingUser.id,
      table: collectionName,
      cookies,
      expired: d().add(7, 'days').toDate()
    })


    //@ts-ignore
    delete existingUser.password;

    cookies.set('access_user', JSON.stringify(existingUser), {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    });
    return json({
      accessToken: sessionId,
      model: existingUser
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return error(400, { message: err.errors.map((e) => e.message).join(', ') });
    }
    throw err;
  }
}
