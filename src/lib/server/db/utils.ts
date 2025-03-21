import {
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';

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
  }

  return pgTable(tableName, {
    id: text('id').primaryKey().notNull().$default(() => createId()),
    ...pgColumns,
    created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
    updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
  });
}