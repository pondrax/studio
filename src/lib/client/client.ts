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

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  admins<TableName extends keyof Schema>(tableName: TableName) {
    return {
      getList: async (
        params?: Record<string, any>
      ): Promise<PaginatedResponse<Schema[TableName]>> => {
        const url = new URL(`${this.baseUrl}/api/admins/schema`);

        if (params) {
          Object.entries(params).forEach(([key, value]) =>
            url.searchParams.append(key, String(value))
          );
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json() as Promise<PaginatedResponse<Schema[TableName]>>;
      }
    };
  }
  from<TableName extends keyof Schema>(tableName: TableName) {
    return {
      getList: async (
        params?: Record<string, any>
      ) => {
        const url = new URL(`${this.baseUrl}/api/collections/${String(tableName)}/records`);

        if (params) {
          Object.entries(params).forEach(([key, value]) =>
            url.searchParams.append(key, String(value))
          );
        }

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.authToken
          },
        });
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json() as Promise<PaginatedResponse<Schema[TableName]>>;
      },
      save: async (
        records: Record<string, FormData>,
      ) => {
        const url = new URL(`${this.baseUrl}/api/collections/${String(tableName)}/records`);
        const response = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.authToken
          },
          body: JSON.stringify(records),
        });
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json() as Promise<Schema[TableName]>;
      },
      delete: async (
        ids: string[],
      ) => {
        const url = new URL(`${this.baseUrl}/api/collections/${String(tableName)}/records`);
        const response = await fetch(url.toString(), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.authToken
          },
          body: JSON.stringify(ids),
        });
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json() as Promise<Schema[TableName]>;
      },
    };
  }
}
