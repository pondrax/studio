import type { Schema } from '$lib/client/schema'
import type { Alert } from './state.svelte';
import { PUBLIC_API_URL } from "$env/static/public";
import { Client } from "$lib/client/client";
import { init } from "@paralleldrive/cuid2";
import { app } from './state.svelte';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { goto } from '$app/navigation';
dayjs.extend(utc);

export const api = new Client<Schema>(PUBLIC_API_URL);
api.beforeSend(async ({ request }) => {
  app.loading = true;
  return request
})

api.afterSend(async ({ request, response, data }) => {
  if (!response.ok) {
    alert({ message: data?.message, type: 'error' });
    app.loading = false;
    throw new Error(data);
  }
  if (request.method === 'POST') {
    if (request.url.indexOf('/records') > 0) {
      alert({ message: 'Record saved', timeout: 3000 })
    }
    if (request.url.indexOf('/auth-with-password') > 0) {
      alert({ message: 'Auth success', timeout: 3000 })
    }
  }
  await delay(500);
  app.loading = false;
  return data;
})

export const alert = ({ message, type = 'success', timeout = -1 }: Partial<Alert>) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const alert = {
    id: createId(),
    message,
    type,
    timeout,
    clear: () => {
      app.alerts = app.alerts.filter(a => a.id !== alert.id);
    },
    start: () => {
      if (timeout < 0) timeout = 100000;
      timeoutId = setTimeout(alert.clear, timeout);
    },
    pause: () => {
      clearTimeout(timeoutId);
    }
  } as Alert;

  alert.start();

  app.alerts = [alert, ...app.alerts];

  return alert;
};

export const d = dayjs;
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const createId = (length = 15) => {
  return init({ length })();
};

export function queryStringify(obj: Record<string, any>) {
  const params = new URLSearchParams(Object.entries(obj).map(([k, v]) => [k, v.toString()]));
  params.delete('expand');
  goto(`?${params}`, { replaceState: true, noScroll: true, keepFocus: true });
}

// autofocus.ts
export function autofocus(node: HTMLElement) {
  // Delay focus to ensure it's after DOM is ready
  const timeout = setTimeout(() => {
    node.focus();
  });

  return {
    destroy() {
      clearTimeout(timeout);
    }
  };
}

export function copyToClipboard(event: Event, text: string) {
  const button = event.currentTarget as HTMLButtonElement;
  const defaultText = button.dataset.tip;
  navigator.clipboard.writeText(text);
  button.dataset.tip = 'Copied!';

  setTimeout(() => {
    button.dataset.tip = defaultText;
  }, 2000);
}

export function downloadJSON(input: Record<string, any>, name: string = 'data') {
  const data = JSON.stringify(input, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(input: Record<string, any>, name: string = 'data', separator: string = ';') {
  const headers = Object.keys(input[0]);
  const rows = Object.values(input);
  const csv =
    headers.join(separator) +
    '\n' +
    rows.map(row => {
      return Object.values(row)
        .map(value => {
          if (typeof value === 'object') {
            return JSON.stringify(value);
          }
          return value;
        })
        .join(separator)
    }).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export {
  app
}
export type { Schema };