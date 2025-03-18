import { db, schema, sdynamic, t, type SQL } from '$lib/server/db';
import { expandQuery, orderQuery } from '$lib/server/db/enhance.js';
import { parseFilter } from '$lib/server/db/filter.js';
import { error, json } from "@sveltejs/kit";

export async function GET({ params, url: { searchParams } }) {

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

  const postUserIds = db.select({ userId: schema.posts.userId }).from(schema.posts).where(t.ilike(schema.posts.title, '%third%'));
  const filterQuery = t.and(t.inArray(schema.users.id, postUserIds))
  // const filterQuery = undefined;
  // const x;
  // @ts-ignore
  const items = db.query[collectionName].findMany({
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

  // const items = db.query['users'].findMany();
  // const items = db.select()
  //   .from(sdynamic.users)
  //   .limit(perPage)
  //   .offset((page - 1) * perPage)
  //   .orderBy((table) => t.eq(table.id, table.email));

  // @ts-ignore
  const totalItems = await db.$count(schema[collectionName]);
  const totalPages = Math.ceil(totalItems / perPage);
  return json({
    message: "Records",
    elapsed: Date.now() - time,
    page,
    perPage,
    totalPages,
    totalItems,
    items: await items,
    parsed
  });
}


export async function POST({ params, url: { searchParams } }) {
  const item = await db.insert(schema['users'])
  return json({})
}

export async function DELETE({ params, request }) {
  const collectionName = params.name as keyof typeof schema;
  const ids = await request.json();
  try {
    // @ts-ignore
    await db.delete(schema[collectionName]).where(t.inArray(schema[collectionName].id, ids));

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