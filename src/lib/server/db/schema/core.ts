import { init } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { pgTable, serial, text, integer, timestamp, json, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const createId = (length = 21) => {
  const cuid = init({ length });
  return cuid();
};
export const _admins = pgTable('_admins', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  avatar: integer('avatar'),
  email: text('email'),
  tokenKey: text('tokenKey'),
  password: text('password').notNull(),
  created: timestamp("created", { withTimezone: true }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true }).defaultNow().$onUpdate(() => new Date())
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
  created: timestamp("created", { withTimezone: true }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true }).defaultNow().$onUpdate(() => new Date())
});

export const _params = pgTable('_params', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  key: text('key'),
  value: json('value'),
  created: timestamp("created", { withTimezone: true }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true }).defaultNow().$onUpdate(() => new Date())
});

export const _externalAuths = pgTable('_externalAuths', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  collectionId: text('collectionId').references(() => _collections.id),
  recordId: text('recordId'),
  provider: text('provider'),
  providerId: text('providerId'),
  created: timestamp("created", { withTimezone: true }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true }).defaultNow().$onUpdate(() => new Date())
});
export const _mailStatus = pgEnum('mailStatus', ['pending', 'sent', 'failed']);
export const _mails = pgTable('_mails', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  to: text('to'),
  title: json('title'),
  content: text('content'),
  status: _mailStatus('status').default('pending'),
  created: timestamp("created", { withTimezone: true }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true }).defaultNow().$onUpdate(() => new Date())
});

export const _logs = pgTable('_logs', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  level: integer('level'),
  message: text('message'),
  data: json('data'),
  created: timestamp("created", { withTimezone: true }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true }).defaultNow().$onUpdate(() => new Date())
});

export const _session = pgTable('_session', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  userId: text('user_id').notNull(),
  table: text('table').notNull(),
  expired: timestamp('expired', { withTimezone: true, mode: 'date' }).notNull()
});
