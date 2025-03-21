
export type Schema = {
  _logs: {
    id: string;
    level: number;
    message: string;
    data: Record<string, any>;
    created: Date;
    updated: Date;
  }
  users: {
    id: string;
    username: string;
    email: string;
    created: Date;
    updated: Date;
  }
  posts: {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
