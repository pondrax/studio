
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
  users: {
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
  }
}
