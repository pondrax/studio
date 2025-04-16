import { createId } from '$lib/app/index.js';
import { db, logger, schema, sdynamic, t, type SQL } from '$lib/server/db';
import { expandQuery, orderQuery } from '$lib/server/db/enhance.js';
import { parseFilter } from '$lib/server/db/filter.js';
import { hash } from '@node-rs/argon2';
import { error, json } from "@sveltejs/kit";
import { writeFile } from 'fs/promises';
import { createInsertSchema } from 'drizzle-zod';

export async function GET({ request, params, url: { searchParams } }) {

  if (!(params.name in schema)) {
    return error(404, "Not Found");
  }
  // console.log(sdynamic);
  const time = Date.now();
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 15);
  const sort = (searchParams.get('sort') || '-created');
  const filter = searchParams.get('filter');
  const expand = searchParams.get('expand');

  const filters: SQL[] = [];
  const parsed = filter ? parseFilter(filter) : {};

  const collectionName = params.name as keyof typeof schema;

  // const postUserIds = db.select({ userId: schema.posts.user_id }).from(schema.posts).where(t.ilike(schema.posts.title, '%third%'));
  // const filterQuery = t.and(t.inArray(schema.users.id, postUserIds))
  // const filterQuery = undefined;
  // const x;
  // @ts-ignore
  let items = db.query[collectionName].findMany({

    // where: filterQuery,
    // where: ((table) => t.and(t.eq(table.id, table.email))),
    // columns: {
    //   password: false,
    // },
    with: expandQuery(expand),
    orderBy: orderQuery(sort, collectionName),
    limit: perPage,
    offset: (page - 1) * perPage,
  })


  items = await items;

  const hiddenFields = ['password', 'passwordConfirm'];
  items = items.map((item: { [x: string]: any; }) => {
    for (const field of hiddenFields) {
      if (item[field]) {
        delete item[field];
      }
    }
    return item
  });
  // const items = db.query['users'].findMany();
  // const items = db.select()
  //   .from(sdynamic.users)
  //   .limit(perPage)
  //   .offset((page - 1) * perPage)
  //   .orderBy((table) => t.eq(table.id, table.email));

  // @ts-ignore
  const totalItems = await db.$count(schema[collectionName]);
  const totalPages = Math.ceil(totalItems / perPage);
  logger({ level: 0, data: {}, request });
  return json({
    message: "Records",
    elapsed: Date.now() - time,
    page,
    perPage,
    totalPages,
    totalItems,
    items: items,
    parsed
  });
}

export async function POST({ params, request }) {
  const collectionName = params.name as keyof typeof schema;
  try {
    const formData = await request.formData();
    const records: Record<string, Record<string, FormDataEntryValue>> = {};

    for (const [key, value] of formData.entries()) {
      const [itemId, fieldName] = key.split(':');
      if (!records[itemId]) records[itemId] = {};

      // console.log(value)
      if (fieldName === 'password') {
        records[itemId][fieldName] = await hash(String(value), {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1
        });
      } else if (value instanceof Blob) {
        const arrayBuffer = await value.arrayBuffer();
        const filename = `${fieldName}-${createId()}`;
        await writeFile(`static/uploads/${collectionName}/${filename}`, Buffer.from(arrayBuffer));
        records[itemId][fieldName] = filename;
      } else {
        if (!['created', 'updated'].includes(fieldName)) {
          try {
            records[itemId][fieldName] = JSON.parse(String(value));
          } catch (e) {
            records[itemId][fieldName] = value;
          }
        }
      }
    }

    for (const [itemId, data] of Object.entries(records)) {
      // @ts-ignore
      const exists = await db.$count(schema[collectionName], t.eq(schema[collectionName].id, itemId));

      if (exists) {
        // @ts-ignore
        await db.update(schema[collectionName]).set(data).where(t.eq(schema[collectionName].id, itemId));
      } else {
        // @ts-ignore
        const insert = createInsertSchema(schema[collectionName]);
        const dataSchema = insert.parse(data);
        // @ts-ignore
        await db.insert(schema[collectionName]).values({ id: itemId, ...dataSchema });
      }
    }

    logger({ level: 0, data: records, request });
    return json({ success: true, data: records });

  } catch (err) {
    logger({ level: 4, data: err, request });
    return error(400, {
      message: 'Bad request',
      // @ts-ignore
      error: err
    });
  }
}

export async function DELETE({ params, request }) {
  const collectionName = params.name as keyof typeof schema;
  const ids = await request.json();
  try {
    // @ts-ignore
    await db.delete(schema[collectionName]).where(t.inArray(schema[collectionName].id, ids));

    logger({ level: 0, data: ids, request });
    return json({
      message: "Deleted",
      items: ids
    })
  } catch (err) {
    logger({ level: 4, data: err, request })
    return error(400, {
      message: 'Bad request',
      // @ts-ignore
      error: err
    });
  }
}