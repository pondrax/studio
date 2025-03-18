import { init } from "@paralleldrive/cuid2";
export { app } from './state.svelte'

// Create a function that generates an ID with a given length
export const createId = (length = 21) => {
  const cuid = init({ length }); // This returns a function
  return cuid(); // Call the function to generate the ID
};

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
    rows.map(row => Object.values(row).join(separator)).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}