import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { notifications, Notifications } from '@mantine/notifications';
import { Router } from './Router';
import { theme } from './theme';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  }),
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <Notifications />
        <Router />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
