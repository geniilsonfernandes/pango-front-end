import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Flex, Paper } from '@mantine/core';
import { SideNavigation } from './components/SideNavigation/SideNavigation';
import { HomePage } from './pages/Home.page';
import { ListsPage } from './pages/Lists.page';

const AppWrapper = () => {
  return (
    <Flex
      component={Paper}
      style={{
        backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
      }}
      gap="lg"
      p="32"
      mih="100vh"
    >
      <SideNavigation initialValue={0} step={1} />
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
        element: <HomePage />,
        ErrorBoundary: () => <h1>Algo deu errado</h1>,
        errorElement: <h1>Algo deu errado</h1>,
      },
      {
        path: '/shopping-lists', // Outra página
        element: <ListsPage />,
        ErrorBoundary: () => <h1>Algo deu errado</h1>,
        errorElement: <h1>Algo deu errado</h1>,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
