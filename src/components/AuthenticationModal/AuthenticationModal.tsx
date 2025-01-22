import { IconBrandGoogle } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import z from 'zod';
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
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { useAuthenticate } from '@/service/queries/Authentication';
import { useCreateUser } from '@/service/queries/user';
import useUserStore from '@/store/userStore';
import { Logo } from '../Logo/Logo';

type AuthenticationModalProps = {} & ModalProps;

const authenticationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long').optional(),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const AuthenticationModal: React.FC<AuthenticationModalProps> = (props) => {
  const queryClient = useQueryClient();
  const [value, toggle] = useToggle(['sign in', 'sign up'] as const);

  //store
  const { login } = useUserStore();

  // mutation
  const { mutate: createUser, isLoading: isCreating } = useCreateUser();
  const { mutate: authenticate, isLoading: isAuthenticating } = useAuthenticate();

  // Form
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(authenticationSchema),
  });

  // Handlers
  const handleCreate = (values: typeof form.values) => {
    if (value === 'sign up') {
      createUser(values, {
        onSuccess: () => {
          authenticate(
            {
              email: values.email,
              password: values.password,
            },
            {
              onSuccess: (data) => {
                if (data) {
                  props.onClose();
                  login(data.user, data.session);
                }
                queryClient.invalidateQueries();
              },
            }
          );
        },
      });
    }
    if (value === 'sign in') {
      authenticate(values, {
        onSuccess: (data) => {
          if (data) {
            props.onClose();
            login(data.user, data.session);
          }
          queryClient.invalidateQueries();
        },
      });
    }
  };

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
          <Title order={4}>
            {value === 'sign in' ? 'Sign in to your account' : 'Create a new account'}
          </Title>
          <Text c="dimmed">
            {value === 'sign in' ? 'Sign in to your account' : 'Create a new account'}
          </Text>
          <form onSubmit={form.onSubmit(handleCreate)}>
            <Grid gutter="md" mt="md" mih="30vh">
              <Grid.Col span={12}>
                <TextInput
                  label="Email"
                  placeholder="ex: name of list"
                  {...form.getInputProps('email')}
                  error={form.errors.email}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <PasswordInput
                  label="Password"
                  placeholder="ex: name of list"
                  {...form.getInputProps('password')}
                  error={form.errors.password}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Stack align="flex-end" gap="xs">
                  <Anchor component="button" size="sm" onClick={close} variant="transparent">
                    Forgot Password
                  </Anchor>
                  <Button
                    type="submit"
                    loading={isCreating || isAuthenticating}
                    disabled={isCreating}
                    fullWidth
                  >
                    {value === 'sign in' ? 'Sign in' : 'Sign up'}
                  </Button>
                  {value === 'sign in' && (
                    <Button
                      onClick={() => props.onClose()}
                      type="button"
                      variant="outline"
                      fullWidth
                    >
                      Continue without sign in
                    </Button>
                  )}
                </Stack>
              </Grid.Col>
            </Grid>
          </form>
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
