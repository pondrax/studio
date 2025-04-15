import type { AppSchema } from "$lib/server/db/schema/app";
export type Schema = AppSchema & {
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
  questions: {
    options: Record<string, string>;
    answer: Record<string, string | number>;
    category: AppSchema["questionsCategory"];
  }
  vacancies: {
    media: FileList;
  }
  users: {
    role?: AppSchema["roles"];
    company?: AppSchema["companies"];
  }
}

// type Expandables = {
//   users: {
//     role?: AppSchema["roles"];
//     company?: AppSchema["companies"];
//     posts?: AppSchema["posts"][];
//   };
//   posts: {
//     users?: AppSchema["users"];
//     comments?: AppSchema["comments"][];
//   };
//   comments: {
//     posts?: AppSchema["posts"];
//     users?: AppSchema["users"];
//   };
//   questions: {
//     category?: AppSchema["questionsCategory"];
//   };
// };

// export type RelatedType<TableName extends keyof AppSchema> = TableName extends keyof Expandables
//   ? Expandables[TableName]
//   : unknown;
