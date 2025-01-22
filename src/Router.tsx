import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Box, Flex, Paper } from '@mantine/core';
import { AuthenticationModal } from './components/AuthenticationModal/AuthenticationModal';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { SideNavigation } from './components/SideNavigation/SideNavigation';
import { ListsDeletedPage } from './pages/Deleted.page';
import { ListPage } from './pages/List.page';
import { ListsPage } from './pages/Lists.page';
import { useCreateAnonymous } from './service/queries/user';
import useModalStore from './store/modalStore';
import useUserStore from './store/userStore';

const AppWrapper = () => {
  const { modals, closeAllModals, closeModal } = useModalStore();
  const { user, login } = useUserStore();
  const queryClient = useQueryClient();

  // mutations
  const { mutate: createAnonymous } = useCreateAnonymous();

  useEffect(() => {
    if (!user) {
      createAnonymous(undefined, {
        onSuccess: (data) => {
          login(data.user, data.session);
          closeAllModals();
          queryClient.invalidateQueries();
        },
      });
    }
  }, []);

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
      <SettingsModal opened={modals.settings || modals.profile} onClose={closeAllModals} />
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
