import { IconLogout2, IconSettings } from '@tabler/icons-react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Box, Button, Divider, Flex, Modal, Paper, Stack, Title } from '@mantine/core';
import { AuthenticationModal } from './components/AuthenticationModal/AuthenticationModal';
import { SideNavigation } from './components/SideNavigation/SideNavigation';
import { ListsDeletedPage } from './pages/Deleted.page';
import { ListPage } from './pages/List.page';
import { ListsPage } from './pages/Lists.page';
import useModalStore from './store/modalStore';
import useUserStore from './store/userStore';

const AppWrapper = () => {
  const { modals, closeAllModals, closeModal } = useModalStore();
  const { logout } = useUserStore();
  return (
    <Flex
      component={Paper}
      style={{
        backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
      }}
      mih="100vh"
    >
      <Box p="md" h="100vh" miw={300} style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <SideNavigation />
      </Box>
      <Outlet />

      <AuthenticationModal
        opened={modals.auth}
        onClose={() => closeModal('auth')}
        size="xl"
        withCloseButton={false}
      />
      <Modal
        opened={modals.settings || modals.profile}
        onClose={() => {
          closeModal('settings');
          closeModal('profile');
        }}
        size="xl"
        title="Settings"
      >
        <Flex gap="md" mih="70vh">
          <Stack justify="space-between">
            <Stack w="200" gap="xxs">
              <Button
                justify="flex-start"
                variant="filled"
                leftSection={<IconSettings size={16} />}
                fullWidth
              >
                General
              </Button>
              <Button
                justify="flex-start"
                variant="subtle"
                leftSection={<IconSettings size={16} />}
                fullWidth
              >
                Account
              </Button>
              <Button
                justify="flex-start"
                variant="subtle"
                leftSection={<IconSettings size={16} />}
                fullWidth
              >
                Settings
              </Button>
              <Button
                justify="flex-start"
                variant="subtle"
                leftSection={<IconSettings size={16} />}
                fullWidth
              >
                About
              </Button>
            </Stack>
            <Button
              justify="flex-start"
              variant="subtle"
              color="red"
              leftSection={<IconLogout2 size={16} />}
              fullWidth
              onClick={() => {
                closeAllModals();
                logout();
              }}
            >
              Logout
            </Button>
          </Stack>
          <Paper bg="dark.8" p="md" style={{ flex: 1 }}>
            <Title order={4}>Settings</Title>
            <Divider my="sm" />
          </Paper>
        </Flex>
      </Modal>
    </Flex>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppWrapper />, // Wrapper para layout comum
    ErrorBoundary: () => <h1>Algo deu errado</h1>,
    errorElement: <h1>Algo deu errado</h1>,
    children: [
      {
        path: '/', // Rota inicial
        element: <ListsPage />,
        ErrorBoundary: () => <h1>Algo deu errado</h1>,
        errorElement: <h1>Algo deu errado</h1>,
      },
      {
        path: '/shopping-lists/:id', // Outra página
        element: <ListPage />,
        ErrorBoundary: () => <h1>Algo deu errado</h1>,
        errorElement: <h1>Algo deu errado</h1>,
      },
      {
        path: '/explore', // Outra página
        element: <ListPage />,
        ErrorBoundary: () => <h1>Algo deu errado</h1>,
        errorElement: <h1>Algo deu errado</h1>,
      },
      {
        path: '/trash', // Outra página
        element: <ListsDeletedPage />,
        ErrorBoundary: () => <h1>Algo deu errado</h1>,
        errorElement: <h1>Algo deu errado</h1>,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
