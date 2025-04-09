import { createId } from "../utils";
import { sql } from "drizzle-orm";
import { pgTable, serial, text, integer, timestamp, json, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const _admins = pgTable('_superuser', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  avatar: integer('avatar'),
  email: text('email'),
  tokenKey: text('tokenKey'),
  password: text('password').notNull(),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
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
  option: json('option'),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const _params = pgTable('_params', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  key: text('key'),
  value: json('value'),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const _externalAuths = pgTable('_externalAuths', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  collectionId: text('collectionId').references(() => _collections.id),
  recordId: text('recordId'),
  provider: text('provider'),
  providerId: text('providerId'),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const _notificationType = pgEnum('notificationType', ['email', 'table']);
export const _notificationStatus = pgEnum('notificationStatus', ['pending', 'sent', 'failed']);
export const _notifications = pgTable('_notifications', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  to: text('to'),
  subject: json('subject'),
  content: text('content'),
  type: _notificationType('type').default('table'),
  status: _notificationStatus('status').default('pending'),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const _logs = pgTable('_logs', {
  id: text('id').primaryKey().notNull().$default(() => createId(15)),
  level: integer('level'),
  message: text('message'),
  data: json('data'),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const _session = pgTable('_session', {
  id: text('id').primaryKey().notNull().$default(() => createId(128)),
  userId: text('user_id').notNull(),
  table: text('table').notNull(),
  expired: timestamp('expired', { withTimezone: true, mode: 'string' }).notNull()
});
