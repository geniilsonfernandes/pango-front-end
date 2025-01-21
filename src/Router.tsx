import { IconBrandGoogle } from '@tabler/icons-react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import {
  Anchor,
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Modal,
  ModalProps,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure, useToggle } from '@mantine/hooks';
import { Logo } from './components/Logo/Logo';
import { SideNavigation } from './components/SideNavigation/SideNavigation';
import { ListsDeletedPage } from './pages/Deleted.page';
import { ListPage } from './pages/List.page';
import { ListsPage } from './pages/Lists.page';

type AuthenticationModalProps = {} & ModalProps;

const AuthenticationModal: React.FC<AuthenticationModalProps> = (props) => {
  const [value, toggle] = useToggle(['sign in', 'sign up']);
  return (
    <Modal
      {...props}
      size="xl"
      withCloseButton={false}
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Flex gap="md" direction={{ base: 'column', md: 'row' }}>
        <Card bg="dark.8" display={{ base: 'none', md: 'block' }} w="100%" flex={1}>
          <Logo />
          <Title order={4} mt="md">
            Welcome to Pango
          </Title>
          <Text c="dimmed" mt="xs">
            The best way to organize your shopping
          </Text>
        </Card>
        <Box maw={{ base: '100%', md: 400 }} p="md" flex={1}>
          <Title order={4}>Log in to Pango</Title>
          <Text c="dimmed">
            {value === 'sign in' ? 'Sign in to your account' : 'Create a new account'}
          </Text>
          <Grid gutter="md" mt="md">
            <Grid.Col span={12}>
              <TextInput label="Email" placeholder="ex: name of list" />
            </Grid.Col>
            <Grid.Col span={12}>
              <PasswordInput label="Password" placeholder="ex: name of list" />
            </Grid.Col>
            <Grid.Col span={12}>
              <Stack align="flex-end" gap="xs">
                <Anchor component="button" size="sm" onClick={close} variant="transparent">
                  Forgot Password
                </Anchor>
                <Button onClick={close} fullWidth>
                  {value === 'sign in' ? 'Sign in' : 'Sign up'}
                </Button>
                <Button onClick={close} variant="outline" fullWidth>
                  Continue without sign in
                </Button>
              </Stack>
            </Grid.Col>
          </Grid>
          <Divider my="lg" label="or" />

          <Stack gap="xs">
            <Button
              onClick={close}
              variant="light"
              leftSection={<IconBrandGoogle size={18} />}
              fullWidth
            >
              Continue with Google
            </Button>
            <Box mt="xs">
              <Text size="sm" c="dimmed">
                {value === 'sign in' ? ' Don`t have an account yet?' : 'Already have an account?'}
              </Text>
              <Anchor size="sm" variant="subtle" onClick={() => toggle()}>
                {value === 'sign in' ? 'Sign up' : 'Sign in'}
              </Anchor>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Modal>
  );
};

const AppWrapper = () => {
  const [opened, { close, open }] = useDisclosure(true);
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

      <AuthenticationModal opened={opened} onClose={close} size="xl" withCloseButton={false} />
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
