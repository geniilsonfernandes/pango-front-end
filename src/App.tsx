


import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';



import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Router } from './Router';
import { useSettingsStore } from './store/settingsStore';
import { theme } from './theme';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
  },
});

export default function App() {
  const settings = useSettingsStore();

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme[settings.selectedTheme.id] || theme.lavenderViolet}>
        <Notifications />
        <Router />
      </MantineProvider>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}