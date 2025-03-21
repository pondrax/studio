export type Alert = {
  id?: string;
  message: string;
  type?: 'success' | 'error' | 'warning';
  timeout?: number;
  pause: () => void;
  start: () => void;
  clear: () => void;
}
type App = {
  sidebar: boolean;
  loading: boolean;
  theme: 'light' | 'dark';
  alerts: Alert[]
}
export const app: App = $state({
  sidebar: true,
  loading: false,
  theme: 'light',
  alerts: []
})


// const addAlert = ({ message, type = 'success', timeout = 2000 }: Alert) => {
//   let timeoutId;

//   const alert = {
//     message,
//     type,
//     timeout,
//     clear: () => {
//       app.alert = app.alert.filter(a => a !== alert);
//     }
//   };

//   // Set timeout for removal
//   const startTimeout = () => {
//     timeoutId = setTimeout(alert.clear, timeout);
//   };

//   // Start the timeout initially
//   startTimeout();

//   // Add event handlers to manage hover
//   // alert.onMouseEnter = () => clearTimeout(timeoutId);
//   // alert.onMouseLeave = startTimeout;

//   app.alert = [...app.alert, alert];
// };

// // Example usage:
// addAlert({ message: 'This is a success message' });
