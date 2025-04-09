import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as core from './schema/core'
import * as app from './schema/app'
import * as orm from 'drizzle-orm';
import { createPgTable } from './utils';
import schemaJson from './_schema.json'
export type { SQL } from 'drizzle-orm'

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL, { prepare: false });

export const t = orm
export const schema = {
  ...core,
  ...app
}


export const sdynamic = {
  ...core,
  users: createPgTable('users', [
    { field: 'username', type: 'text', notNull: true },
    { field: 'email', type: 'text', notNull: true },
    { field: 'password', type: 'text', notNull: true },
  ]),
  posts: createPgTable('posts', [
    { field: 'title', type: 'text', notNull: true },
    { field: 'slug', type: 'text', notNull: true },
    { field: 'content', type: 'text', notNull: true },
  ] as const),
  comments: createPgTable('comments', [
    { field: 'content', type: 'text', notNull: true },
  ] as const)
}

sdynamic.users

// export const sdynamic = {
//   ...core,
//   ...Object.fromEntries(
//     Object.entries(schemaJson).map(([key, value]) => [key, createPgTable(key, value)])
//   )
// // };
// export const sdynamic = {
//   ...core,
//   users: createPgTable('users', [
//     { field: 'username', type: 'text', notNull: true },
//     { field: 'email', type: 'text', notNull: true },
//     { field: 'password', type: 'text', notNull: true },
//   ] as const),
//   posts: createPgTable('posts', [
//     { field: 'title', type: 'text', notNull: true },
//     { field: 'slug', type: 'text', notNull: true },
//     { field: 'content', type: 'text', notNull: true },
//   ] as const),
//   comments: createPgTable('comments', [
//     { field: 'content', type: 'text', notNull: true },
//   ] as const)
// }
export const admin = drizzle({
  client,
  schema: core
})

// console.log(dynamic)
// console.log(app.users._.config)
export const db = drizzle({
  client,
  schema
});

export const logger = async ({ level = 0, data, request }: { level: number, data: any, request: Request }) => {

  const remoteIp = request.headers.get('x-forwarded-for') ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-client-ip') ||
    '127.0.0.1';

  await db.insert(schema['_logs']).values([
    {
      level,
      message: 'err',
      data: {
        ...data,
        url: request.url,
        method: request.method,
        remoteIp
      },
    }
  ])
}

// console.log(db.select().from(dynamic))