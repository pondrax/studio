// import { db, t, schema } from '$lib/server/db';
// import { createId } from '$lib/utils';
// import { error, json } from "@sveltejs/kit";

// export async function GET({ params }) {
//   if (!(params.name in schema)) {
//     return error(404, "Not Found");
//   }

//   // Insert Users
//   const [user1Id, user2Id, user3Id] = [createId(), createId(), createId()];

//   await db.insert(schema.users).values([
//     { id: user1Id, email: "alice@example.com" + Math.random(), username: "alice" + Math.random(), password: "hashedpassword" },
//     { id: user2Id, email: "bob@example.com" + Math.random(), username: "bob" + Math.random(), password: "hashedpassword" },
//     { id: user3Id, email: "charlie@example.com" + Math.random(), username: "charlie" + Math.random(), password: "hashedpassword" },
//   ]);

//   // Insert Posts
//   const [post1Id, post2Id, post3Id] = [createId(), createId(), createId()];

//   await db.insert(schema.posts).values([
//     { id: post1Id, title: "First Post", slug: "first-post" + createId(), content: "This is the first post.", userId: user1Id },
//     { id: post2Id, title: "Second Post", slug: "second-post" + createId(), content: "This is the second post.", userId: user2Id },
//     { id: post3Id, title: "Third Post", slug: "third-post" + createId(), content: "This is the third post.", userId: user3Id },
//   ]);

//   // Insert Comments (Users commenting on different posts)
//   await db.insert(schema.comments).values([
//     { content: "Great post!", userId: user2Id, postId: post1Id },
//     { content: "Thanks for sharing.", userId: user1Id, postId: post2Id },
//     { content: "Interesting perspective!", userId: user3Id, postId: post1Id },
//     { content: "I totally agree.", userId: user1Id, postId: post3Id },
//     { content: "Could you elaborate?", userId: user2Id, postId: post3Id },
//   ]);
//   // const tableName = params.name as keyof typeof schema;
//   // console.log(params)
//   // const item = await db.query[tableName]
//   //   // @ts-ignore
//   //   .findFirst({
//   //     where: t.eq(schema[tableName].id, params.id)
//   //   });

//   return json({
//     message: "Records",
//     // item,
//   });
// }
