import { DATABASE_URL } from "$env/static/private";
import { db, t, schema } from ".";

const rand = DATABASE_URL.indexOf('mysql://') > -1 ?
  t.sql`RAND()` :
  t.sql`RANDOM()`;

export function expandQuery(expand: string | null): Record<string, any> {
  if (!expand) return {};
  const result: Record<string, any> = {};

  for (const path of expand.split(',')) {
    let current = result;
    const parts = path.split('.');

    for (const part of parts) {
      current[part] ||= { with: {} }; // Ensure each level has `with`
      current = current[part].with; // Move deeper into `with`
    }
  }

  return result;
}
export function orderQuery(orderBy: string, tableName: keyof typeof schema) {
  const table = schema[tableName];
  const sort = [];
  for (const field of orderBy.split(',')) {
    if (field === '@random') {
      sort.push(rand);
      continue
    }
    const column = table[field.replace(/^[-+]/, '') as keyof typeof table];
    sort.push(
      field.startsWith('-') ?
        t.desc(column) :
        t.asc(column)
    );
  };
  return sort;
}

export function filterQuery(filter: string) {
}
