import { db, logger, schema, t, type SQL } from '$lib/server/db';
import { expandQuery, orderQuery } from '$lib/server/db/enhance.js';
import { parseFilter } from '$lib/server/db/filter.js';
import { error, json } from "@sveltejs/kit";

export async function GET({ request, url: { searchParams } }) {
  // console.log(sdynamic);
  const time = Date.now();
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('perPage') || 15);
  const sort = (searchParams.get('sort') || '-created');
  const filter = searchParams.get('filter');
  const expand = searchParams.get('expand');

  const filters: SQL[] = [];
  const parsed = filter ? parseFilter(filter) : {};

  const postUserIds = db.select({ userId: schema.posts.userId }).from(schema.posts).where(t.ilike(schema.posts.title, '%third%'));
  const filterQuery = t.and(t.inArray(schema.users.id, postUserIds))
  // const filterQuery = undefined;
  // const x;
  const items = db.query['_notifications'].findMany({
    // where: filterQuery,
    // where: ((table) => t.and(t.eq(table.id, table.email))),
    // columns: {
    //   password: false,
    // },
    with: expandQuery(expand),
    orderBy: orderQuery(sort, '_notifications'),
    limit: perPage,
    offset: (page - 1) * perPage,
  })

  const totalItems = await db.$count(schema['_notifications']);
  const totalPages = Math.ceil(totalItems / perPage);
  logger({ level: 0, data: {}, request });
  return json({
    message: "Notifications",
    elapsed: Date.now() - time,
    page,
    perPage,
    totalPages,
    totalItems,
    items: await items
  });
}



export async function POST({ request }) {
  try {
    const table = schema['_notifications']
    const formData = await request.formData();
    const records: Record<string, Record<string, FormDataEntryValue>> = {};

    for (const [key, value] of formData.entries()) {
      const [itemId, fieldName] = key.split(':');
      (records[itemId] ??= {})[fieldName] = value;
    }

    for (const [itemId, data] of Object.entries(records)) {
      const exists = await db.$count(table, t.eq(table.id, itemId));
      if (exists) {
        await db.update(table).set(data).where(t.eq(table.id, itemId));
      } else {
        await db.insert(table).values(data)
      }
    }
    logger({ level: 0, data: records, request });
    return json({ success: true, data: records });
  } catch (err) {
    logger({
      level: 4,
      request,
      data: {
        error: err
      },
    })
    return new Response(
      JSON.stringify({
        error: err
      }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // return error(400, {
    //   message: 'Bad request ' + err,
    //   error: err
    // })
  }
}

export async function DELETE({ request }) {
  const ids = await request.json();
  try {
    await db.delete(schema['_notifications']).where(t.inArray(schema['_notifications'].id, ids));
    logger({ level: 0, data: {}, request });
    return json({
      message: "Deleted",
      items: ids
    })
  } catch (err) {
    logger({
      level: 4, data: {
        error: err
      }, request
    });
    return error(400, {
      message: 'Bad request ' + err,

    })
  }
}