import { init } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const createId = (length = 21) => {
  const cuid = init({ length });
  return cuid();
};
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => createId(15)),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const posts = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => createId(15)),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const comments = pgTable("comments", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => createId(15)),
  content: text("content").notNull(),
  file: text("file"),
  userId: text("user_id").references(() => users.id),
  postId: text("post_id").references(() => posts.id),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
  users: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  posts: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  users: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;

