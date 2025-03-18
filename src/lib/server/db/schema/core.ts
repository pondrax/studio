import { createId } from '../../../utils';
import { pgTable, serial, text, integer, timestamp, json, boolean } from 'drizzle-orm/pg-core';

export const _admins = pgTable('_admins', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  avatar: integer('avatar'),
  email: text('email'),
  tokenKey: text('tokenKey'),
  password: text('password').notNull(),
  created: timestamp('created', { withTimezone: true, mode: 'date' }),
  updated: timestamp('updated', { withTimezone: true, mode: 'date' })
});

export const _collections = pgTable('_collections', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  system: boolean('system'),
  type: text('type'),
  name: text('name'),
  schema: json('schema'),
  indexes: json('indexes'),
  listRule: text('listRule'),
  viewRule: text('viewRule'),
  createRule: text('createRule'),
  updateRule: text('updateRule'),
  deleteRule: text('deleteRule'),
  created: timestamp('created', { withTimezone: true, mode: 'date' }),
  updated: timestamp('updated', { withTimezone: true, mode: 'date' })
});

export const _params = pgTable('_params', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  key: text('key'),
  value: json('value'),
  created: timestamp('created', { withTimezone: true, mode: 'date' }),
  updated: timestamp('updated', { withTimezone: true, mode: 'date' })
});

export const _externalAuths = pgTable('_externalAuths', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  collectionId: text('collectionId').references(() => _collections.id),
  recordId: text('recordId'),
  provider: text('provider'),
  providerId: text('providerId'),
  created: timestamp('created', { withTimezone: true, mode: 'date' }),
  updated: timestamp('updated', { withTimezone: true, mode: 'date' })
});

export const _logs = pgTable('_logs', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  level: integer('level'),
  message: text('message'),
  data: json('data'),
  created: timestamp('created', { withTimezone: true, mode: 'date' }),
  updated: timestamp('updated', { withTimezone: true, mode: 'date' })
});


export const _session = pgTable('_session', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  userId: text('user_id').notNull(),
  expired: timestamp('expired', { withTimezone: true, mode: 'date' }).notNull()
});
