import { createId } from "../utils";
import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, pgEnum, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => createId(15)),
  email: text("email").notNull().unique(),
  verified: boolean("verified"),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

const applicants = pgTable("applicants", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => createId(15)),
  email: text("email").notNull().unique(),
  verified: boolean("verified"),
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
  media: text("media").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const pages = pgTable("pages", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => createId(15)),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  media: text("media").notNull(),
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




export const questionsCategoryStatus = pgEnum('status', ['active', 'inactive']);
export const questionsCategory = pgTable("questionsCategory", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => createId(15)),
  name: text("name").notNull(),
  description: text("description").unique(),
  status: questionsCategoryStatus('status').default('active'),
  protected: boolean("protected").default(false),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});
export const questions = pgTable("questions", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => createId(15)),
  question: text("question").notNull(),
  option: json("option"),
  answer: json("answer"),
  category: text("category").notNull().references(() => questionsCategory.id),
  created: timestamp("created", { withTimezone: true, mode: 'string' }).defaultNow(),
  updated: timestamp("updated", { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`NOW()`)
});

export const questionsRelations = relations(questions, ({ many, one }) => ({
  expandCategory: one(questionsCategory, { fields: [questions.category], references: [questionsCategory.id] }),
}));

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type UserSelect = typeof users.$inferSelect;
export type QuestionsSelect = typeof questions.$inferSelect;
export type QuestionsCategorySelect = typeof questionsCategory.$inferSelect;

export {
  applicants
}