
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
    created: string;
    updated: string;
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
