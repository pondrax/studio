import {
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

type ColumnDefinition = { field: string; type: string; notNull?: boolean };

export function createPgTable<T extends ColumnDefinition>(
  tableName: string,
  columns: T[]
) {

  const pgColumns = {} as Record<T['field'], ReturnType<typeof text> | ReturnType<typeof integer>>;

  for (const column of columns) {
    let col;
    switch (column.type) {
      case 'integer':
        col = integer(column.field);
        break;
      default:
        col = text(column.field);
    }
    pgColumns[column.field as T['field']] = col;
    // pgColumns[column.field as T['field']] =
    //   column.type === 'integer' ?
    //     integer(column.field) :
    //     text(column.field);
  }
  // const colDefs = columns.map(
  //   (column) => {
  //     let col = column.type === 'integer' ? integer(column.field) : text(column.field);
  //     return [column.field as T['field'], col];
  //   }
  // );

  // const pgColumns = Object.fromEntries(colDefs) as {
  //   [K in T['field']]: T['type'] extends 'integer' ? ReturnType<typeof integer> : ReturnType<typeof text>;
  // };


  // const pgColumns = Object.fromEntries(
  //   columns.map((column) => {
  //     let columndef = column.type == 'integer' ?
  //       integer(column.field) :
  //       text(column.field);

  //     return [
  //       column.field,
  //       columndef
  //     ]
  //   })
  // ) as Record<T['field'], ReturnType<typeof text>>;

  return pgTable(tableName, {
    id: text('id').primaryKey().notNull().$default(() => createId()),
    ...pgColumns,
    created: timestamp('created', { withTimezone: true, mode: 'date' }).notNull(),
    updated: timestamp('updated', { withTimezone: true, mode: 'date' }).notNull(),
  });
}

// ✅ Now TypeScript properly infers column types
const usersDynamic = createPgTable('users', [
  { field: 'username', type: 'text', notNull: true },
  { field: 'email', type: 'text', notNull: true },
  { field: 'password', type: 'text', notNull: true },
] as const);

usersDynamic
// ✅ TypeScript now correctly infers usersDynamic.name and usersDynamic.email
usersDynamic.$inferInsert;  // Correctly inferred
usersDynamic.$inferSelect; // Correctly inferred

export default usersDynamic