import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as core from './schema/core'
import * as app from './schema/app'
import * as orm from 'drizzle-orm';
import dynamic, { createPgTable } from './utils';

export type { SQL } from 'drizzle-orm'

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

export const t = orm
export const schema = {
  ...core,
  ...app
}
export const sdynamic = {
  users: createPgTable('users', [
    { field: 'username', type: 'text', notNull: true },
    { field: 'email', type: 'text', notNull: true },
    { field: 'password', type: 'text', notNull: true },
  ] as const),
  posts: createPgTable('posts', [
    { field: 'title', type: 'text', notNull: true },
    { field: 'slug', type: 'text', notNull: true },
    { field: 'content', type: 'text', notNull: true },
  ] as const),
  comments: createPgTable('comments', [
    { field: 'content', type: 'text', notNull: true },
  ] as const)
}
export const admin = drizzle({
  client,
  schema: core
})

// console.log(dynamic)
// console.log(app.users._.config)
export const db = drizzle({
  client,
  schema: sdynamic
});


// console.log(db.select().from(dynamic))