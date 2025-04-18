import { id, created, updated } from "../utils";
import { relations } from "drizzle-orm";
import { pgTable, text, boolean, pgEnum, json, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  verified: boolean("verified"),
  username: text("username").notNull().unique(),
  password: text("password"),
  avatar: text("avatar"),
  nrp: text("nrp"),
  phone: text("phone"),
  birth: text("birth"),
  role_id: text("role_id").references(() => roles.id),
  company_id: text("company_id").references(() => companies.id),
  created,
  updated,
});

export const roles = pgTable("roles", {
  id: id(),
  name: text("name").notNull().unique(),
  description: text("description"),
  permissions: json("permissions").default([]),
  active: boolean("active").default(true),
  created,
  updated,
});

export const companies = pgTable("companies", {
  id: id(),
  name: text("name").notNull().unique(),
  abbrv: text("abbrv"),
  active: boolean('active').default(true),
  created,
  updated,
});

export const applicants = pgTable("applicants", {
  id: id(),
  email: text("email").notNull().unique(),
  verified: boolean("verified"),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  created,
  updated,
});

export const posts = pgTable("posts", {
  id: id(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  media: text("media"),
  user_id: text("user_id").references(() => users.id),
  created,
  updated,
});

export const pages = pgTable("pages", {
  id: id(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  media: text("media"),
  user_id: text("user_id").references(() => users.id),
  created,
  updated,
});

export const comments = pgTable("comments", {
  id: id(),
  content: text("content").notNull(),
  file: text("file"),
  user_id: text("user_id").references(() => users.id),
  post_id: text("post_id").references(() => posts.id),
  created,
  updated,
});



export const questions = pgTable("questions", {
  id: id(),
  question: text("question").notNull(),
  options: json("options"),
  answer: json("answer"),
  category_id: text("category_id").notNull().references(() => questionsCategory.id),
  created,
  updated,
});

export const questionsCategory = pgTable("questionsCategory", {
  id: id(),
  name: text("name").notNull(),
  description: text("description").unique(),
  status: boolean('status').default(true),
  protected: boolean("protected").default(false),
  created,
  updated,
});


export const questionsTemplate = pgTable("questionsTemplate", {
  id: id(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  grouping: json("grouping").default([]),
  created,
  updated,
});
export const vacanciesStatus = pgEnum("status", ["draft", "published", "closed"])
export const vacancies = pgTable("vacancies", {
  id: id(),
  title: text("title").notNull(),
  description: text("description"),
  media: text("media"),
  category: text("category").notNull(),
  criteria: json("criteria").default([]),
  quota: integer("quota").default(10),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  status: vacanciesStatus("status").default("draft"),
  created,
  updated,
});

export const vacanciesAppliedStatus = pgEnum("status", ["applied", "passed", "rejected", "interview", "offer", "hired"])
export const vacanciesApplied = pgTable("vacanciesApplied", {
  id: id(),
  user_id: text("user_id").notNull(),
  category: text("category").notNull(),
  status: vacanciesAppliedStatus("status").default("applied"),
  created,
  updated,
});

export const referencesCategory = pgTable("referencesCategory", {
  id: id(),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(),
  type: text("type").notNull(),
  created,
  updated,
});

export const references = pgTable("references", {
  id: id(),
  order: integer("order").default(0),
  name: text("name").notNull(),
  value: text("value").default(''),
  category_id: text("category_id").notNull().references(() => referencesCategory.id),
  active: boolean("active").default(false),
  created,
  updated,
});

export const userRelations = relations(users, ({ many, one }) => ({
  role: one(roles, { fields: [users.role_id], references: [roles.id] }),
  company: one(companies, { fields: [users.company_id], references: [companies.id] }),
  posts: many(posts),
  pages: many(pages),
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
  users: one(users, { fields: [posts.user_id], references: [users.id] }),
  comments: many(comments),
}));
export const pagesRelations = relations(pages, ({ one }) => ({
  users: one(users, { fields: [pages.user_id], references: [users.id] }),
}));
export const commentsRelations = relations(comments, ({ one }) => ({
  posts: one(posts, { fields: [comments.post_id], references: [posts.id] }),
  users: one(users, { fields: [comments.user_id], references: [users.id] }),
}));

export const questionsRelations = relations(questions, ({ many, one }) => ({
  category: one(questionsCategory, { fields: [questions.category_id], references: [questionsCategory.id] }),
}));
export const questionsCategoryRelations = relations(questionsCategory, ({ many }) => ({
  questions: many(questions),
}));
export const vacanciesRelations = relations(vacancies, ({ many }) => ({
  applicants: many(applicants),
}));
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));
export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  vacancies: many(vacancies),
}));
export const referencesCategoryRelations = relations(referencesCategory, ({ many }) => ({
  references: many(references),
}))
export const referencesRelations = relations(references, ({ one }) => ({
  category: one(referencesCategory, { fields: [references.category_id], references: [referencesCategory.id] }),
}))



export type AppSchema = {
  users: typeof users.$inferSelect;
  applicants: typeof applicants.$inferSelect;
  roles: typeof roles.$inferSelect;
  companies: typeof companies.$inferSelect;
  posts: typeof posts.$inferSelect;
  pages: typeof pages.$inferSelect;
  comments: typeof comments.$inferSelect;
  questions: typeof questions.$inferSelect;
  questionsCategory: typeof questionsCategory.$inferSelect;
  vacancies: typeof vacancies.$inferSelect;
  vacanciesApplied: typeof vacanciesApplied.$inferSelect;
  referencesCategory: typeof referencesCategory.$inferSelect;
  references: typeof references.$inferSelect;

}
