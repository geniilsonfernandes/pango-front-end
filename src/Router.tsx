import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppWrapper } from './components/AppWrapper/AppWrapper';
import { AcceptListPage } from './pages/AcceptList.page';
import { ListsDeletedPage } from './pages/Deleted.page';
import { ExplorePage } from './pages/Explore.page';
import { ListPage } from './pages/List.page';
import { ListsPage } from './pages/Lists.page';

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
        path: '/list/:id', // Outra página
        element: <ListPage />,
        ErrorBoundary: () => <h1>Algo deu errado</h1>,
        errorElement: <h1>Algo deu errado</h1>,
      },
      {
        path: '/list/share/:id', // Outra página
        element: <AcceptListPage />,
        ErrorBoundary: () => <h1>Algo deu errado</h1>,
        errorElement: <h1>Algo deu errado</h1>,
      },

      {
        path: '/explore', // Outra página
        element: <ExplorePage />,
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