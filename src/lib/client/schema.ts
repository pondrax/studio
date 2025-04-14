import type { QuestionsSelect, QuestionsCategorySelect, UserSelect } from "$lib/server/db/schema/app";
export type Schema = {
  _logs: {
    id: string;
    level: number;
    message: string;
    data: Record<string, any>;
    created: Date;
    updated: Date;
  }
  _notifications: {
    id: string;
    type: 'email' | 'table';
    to: string;
    subject?: string;
    content?: string;
    status?: string;
    scheduled?: string;
    sent?: string;
    created: Date;
    updated: Date;
  }
  users: UserSelect
  // users: {
  //   id: string;
  //   username: string;
  //   email: string;
  //   password: string;
  //   passwordConfirm?: string;
  //   active: boolean;
  //   created: string;
  //   updated: string;
  // }
  applicants: {
    id: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    active: boolean;
    created: string;
    updated: string;
  }
  posts: {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
  },
  questions: QuestionsSelect & {
    option: Record<string, string>;
    answer: Record<string, string>;
    expandCategory?: QuestionsCategorySelect
  },
  questionsCategory: QuestionsCategorySelect,
}
