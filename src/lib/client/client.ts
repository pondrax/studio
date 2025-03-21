type PaginatedResponse<T> = {
  elapsed: number;
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
};

export class Client<Schema extends Record<string, any>> {
  private baseUrl: string;
  private beforeSendHook?: (context: { request: Request }) => Promise<Request> | Request;
  private afterSendHook?: (context: { request: Request; response: Response; data: any }) => Promise<any> | any;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  beforeSend(hook: (context: { request: Request }) => Promise<Request> | Request): void {
    this.beforeSendHook = hook;
  }

  afterSend(hook: (context: { request: Request; response: Response; data: any }) => Promise<any> | any): void {
    this.afterSendHook = hook;
  }

  private async executeBeforeSend(request: Request): Promise<Request> {
    const token = localStorage.getItem('authToken');
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }

    if (this.beforeSendHook) {
      return this.beforeSendHook({ request });
    }
    return request;
  }

  private async executeAfterSend(request: Request, response: Response): Promise<any> {
    const data = await response.json();
    if (this.afterSendHook) {
      return this.afterSendHook({ request, response, data });
    }
    return data;
  }

  logs() {
    return {
      getList: async (params?: Record<string, any>): Promise<PaginatedResponse<Schema["_logs"]>> => {
        const url = new URL(`${this.baseUrl}/api/admins/logs`);

        if (params) {
          Object.entries(params).forEach(([key, value]) =>
            url.searchParams.append(key, String(value))
          );
        }

        let request = new Request(url.toString(), { method: 'GET' });
        request = await this.executeBeforeSend(request);

        const response = await fetch(request);
        return this.executeAfterSend(request, response);
      },
      delete: async (ids: string[]) => {
        const url = new URL(`${this.baseUrl}/api/admins/logs`);
        let request = new Request(url.toString(), {
          method: 'DELETE',
          body: JSON.stringify(ids),
        });
        request = await this.executeBeforeSend(request);

        const response = await fetch(request);
        return this.executeAfterSend(request, response);
      }
    };
  }

  from<TableName extends keyof Schema>(tableName: TableName) {
    return {
      getList: async (params?: Record<string, any>) => {
        const url = new URL(`${this.baseUrl}/api/collections/${String(tableName)}/records`);

        if (params) {
          Object.entries(params).forEach(([key, value]) =>
            url.searchParams.append(key, String(value))
          );
        }

        let request = new Request(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        request = await this.executeBeforeSend(request);

        const response = await fetch(request);
        return this.executeAfterSend(request, response);
      },
      save: async (records: Record<string, FormData>) => {
        const forms = new FormData();

        for (const [itemId, data] of Object.entries(records)) {
          for (const [key, value] of Object.entries(data)) {
            forms.append(`${itemId}:${key}`, value);
          }
        }

        const url = new URL(`${this.baseUrl}/api/collections/${String(tableName)}/records`);
        let request = new Request(url.toString(), {
          method: 'POST',
          body: forms,
        });
        request = await this.executeBeforeSend(request);

        const response = await fetch(request);
        return this.executeAfterSend(request, response);
      },
      delete: async (ids: string[]) => {
        const url = new URL(`${this.baseUrl}/api/collections/${String(tableName)}/records`);
        let request = new Request(url.toString(), {
          method: 'DELETE',
          body: JSON.stringify(ids),
        });
        request = await this.executeBeforeSend(request);

        const response = await fetch(request);
        return this.executeAfterSend(request, response);
      },
    };
  }
}