import {
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { init } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';

export const createId = (length = 15) => {
  const cuid = init({ length });
  return cuid();
};
export const id = (length = 15) => text("id")
  .primaryKey()
  .notNull()
  .$default(() => createId(length))
export const created = timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow();
export const updated = timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`);

type ColumnDefinition = {
  field: string;
  type: string;
  notNull?: boolean;
  unique?: boolean;
  references?: string;
};
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
    id: text('id').primaryKey().notNull().$defaultFn(() => createId()),
    ...pgColumns,
    created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
    updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
  });
}