import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Box, Flex, Paper } from '@mantine/core';
import { SideNavigation } from './components/SideNavigation/SideNavigation';
import { ListPage } from './pages/List.page';
import { ListsPage } from './pages/Lists.page';

const AppWrapper = () => {
  return (
    <Flex
      component={Paper}
      style={{
        backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
      }}
      mih="100vh"
    >
      <Box p="md" h="100vh" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <SideNavigation initialValue={0} step={1} />
      </Box>
      <Outlet />
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
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
