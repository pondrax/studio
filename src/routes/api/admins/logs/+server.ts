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
  const items = db.query['_logs'].findMany({
    // where: filterQuery,
    // where: ((table) => t.and(t.eq(table.id, table.email))),
    // columns: {
    //   password: false,
    // },
    with: expandQuery(expand),
    orderBy: orderQuery(sort, '_logs'),
    limit: perPage,
    offset: (page - 1) * perPage,
  })

  const totalItems = await db.$count(schema['_logs']);
  const totalPages = Math.ceil(totalItems / perPage);
  return json({
    message: "Logs",
    elapsed: Date.now() - time,
    page,
    perPage,
    totalPages,
    totalItems,
    items: await items
  });
}



export async function DELETE({ request }) {
  const ids = await request.json();
  try {
    await db.delete(schema['_logs']).where(t.inArray(schema['_logs'].id, ids));
    return json({
      message: "Deleted",
      items: ids
    })
  } catch (err) {
    return error(400, {
      message: 'Bad request ' + err,
    })
  }
}