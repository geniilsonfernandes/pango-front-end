import React, { useState } from 'react';
import {
  IconAlertCircle,
  IconCheck,
  IconEdit,
  IconInfoCircle,
  IconList,
  IconLogout2,
  IconSettings,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, useAnimation } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Flex,
  Group,
  List,
  Modal,
  ModalProps,
  Paper,
  PasswordInput,
  Select,
  SelectProps,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  useChangePassword,
  useCreateAnonymous,
  useDeleteAccount,
  useEditUser,
} from '@/service/queries/user';
import useModalStore from '@/store/modalStore';
import { currencies, Theme, useSettingsStore } from '@/store/settingsStore';
import useUserStore from '@/store/userStore';
import { themes } from '@/theme';

type SettingsModalProps = {} & ModalProps;
const iconProps = {
  color: 'currentColor',
  opacity: 0.6,
  size: 18,
};

const menus = [
  { value: 'general', label: 'General', icon: <IconSettings {...iconProps} /> },
  { value: 'account', label: 'Account', icon: <IconUser {...iconProps} /> },
  { value: 'lists', label: 'Lists', icon: <IconList {...iconProps} /> },
  { value: 'about', label: 'About', icon: <IconInfoCircle {...iconProps} /> },
] as const;

// The components are here and will only be used in this modal, so it doesn’t make sense to place them elsewhere. if, need to be used elsewhare, i will move to separete file

export const editUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').optional(),
});

const EditableUser: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const { user, setUser, isAnonymous } = useUserStore();

  const form = useForm({
    initialValues: {
      name: user?.name || user?.email || '',
      email: user?.email || '',
    },
    validate: zodResolver(editUserSchema),
  });

  const controls = useAnimation();

  const startAnimation = () => {
    controls.start({
      backgroundColor: ['#ffffff00', '#1fff005c', '#ffffff00'],
      transition: {
        duration: 1,
        times: [0, 0.5, 1],
      },
    });
  };

  // mutations
  const { mutate: updateUser, isLoading: isUpdating } = useEditUser();

  // Handlers
  const handleUpdate = (values: typeof form.values) => {
    updateUser(
      {
        id: user?.id as string,
        ...values,
        email: user?.email as string,
      },
      {
        onSuccess: (data) => {
          setUser(data);
          startAnimation();
          toggle();
        },
      }
    );
  };

  return (
    <motion.form animate={controls} key="user" onSubmit={form.onSubmit(handleUpdate)}>
      <Stack gap="xs">
        <Stack>
          <TextInput
            label="Name"
            description="Your name will be displayed in the app"
            placeholder="John Doe"
            variant="filled"
            disabled={!opened}
            {...form.getInputProps('name')}
            error={form.errors.name}
            rightSection={
              <ActionIcon size="sm" variant="transparent" onClick={toggle}>
                <IconEdit size={16} />
              </ActionIcon>
            }
          />
          <Collapse in={opened}>
            <Group gap="xs">
              <Button
                variant="filled"
                type="submit"
                loading={isUpdating}
                disabled={!form.isValid()}
              >
                Save
              </Button>
              <Button
                variant="light"
                onClick={() => {
                  form.reset();
                  toggle();
                }}
              >
                Cancel
              </Button>
            </Group>
          </Collapse>
        </Stack>
        {!isAnonymous && (
          <TextInput
            label="Email"
            description="Your email will be displayed in the app"
            variant="filled"
            defaultValue={user?.email}
            disabled
            error={form.errors.email}
          />
        )}
      </Stack>
    </motion.form>
  );
};

export const editUserPasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Password required').max(100, 'Password is too long'),
    newPassword: z
      .string()
      .min(6, 'Password is required')
      .max(100, 'Password is too long')
      .regex(/[0-9]/, 'Password must contain at least one number') // Verifica se há pelo menos um número
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'), // Verifica se há pelo menos um caractere especial
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: 'New password cannot be the same as the old password',
    path: ['newPassword'],
  });

const EditablePasswordInput: React.FC = () => {
  const { user } = useUserStore();
  const [opened, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      newPassword: '',
      oldPassword: '',
    },
    validate: zodResolver(editUserPasswordSchema),
  });

  const controls = useAnimation();

  const startAnimation = () => {
    controls.start({
      backgroundColor: ['#ffffff00', '#1fff005c', '#ffffff00'],
      transition: {
        duration: 1,
        times: [0, 0.5, 1],
      },
    });
  };

  // mutations
  const { mutate: changePassword, isLoading: isUpdating } = useChangePassword();

  // Handlers
  const handleChangePassword = (values: typeof form.values) => {
    const data = editUserPasswordSchema.parse(values);
    console.log({ data, values });

    changePassword(
      {
        id: user?.id as string,
        ...values,
      },
      {
        onSuccess: () => {
          toggle();
          startAnimation();
        },
      }
    );
  };

  return (
    <motion.form animate={controls} onSubmit={form.onSubmit(handleChangePassword)}>
      <Stack gap="xs">
        <PasswordInput
          visible={false}
          label="Password"
          description="Edit your password"
          placeholder="••••••••"
          variant="filled"
          disabled={!opened}
          rightSection={
            <ActionIcon size="sm" variant="transparent" onClick={toggle}>
              <IconEdit size={16} />
            </ActionIcon>
          }
        />

        <Collapse in={opened}>
          <Stack gap="xs">
            <PasswordInput
              label="Old Password"
              description="Enter your current password"
              placeholder="Enter current password"
              variant="filled"
              {...form.getInputProps('oldPassword')}
              error={form.errors.oldPassword}
            />
            <PasswordInput
              label="New Password"
              description="Choose a new password"
              placeholder="Enter new password"
              variant="filled"
              {...form.getInputProps('newPassword')}
              error={form.errors.newPassword}
            />

            <Group gap="xs">
              <Button variant="filled" type="submit" loading={isUpdating}>
                Save
              </Button>
              <Button variant="light" onClick={toggle}>
                Cancel
              </Button>
            </Group>
          </Stack>
        </Collapse>
      </Stack>
    </motion.form>
  );
};

const DeleteAccountSchema = z.object({
  email: z.string().email(),
});

const DeleteAccount: React.FC = () => {
  const queryClient = useQueryClient();
  const [opened, { close, open }] = useDisclosure(false);
  const { user, logout, login } = useUserStore();
  const { closeAllModals } = useModalStore();

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: zodResolver(DeleteAccountSchema),
  });

  // mutations
  const { mutate: deleteAccount, isLoading: isDeleting } = useDeleteAccount();
  const { mutate: createAnonymous } = useCreateAnonymous();

  // handlers

  const handleDelete = (values: typeof form.values) => {
    if (values.email !== user?.email) {
      form.setFieldError('email', 'Email is not correct');
    } else {
      deleteAccount(user.id, {
        onSuccess: () => {
          handleLogout();
        },
      });
    }
  };

  const handleLogout = () => {
    logout();
    createAnonymous(undefined, {
      onSuccess: (data) => {
        login(data.user, data.session);
        closeAllModals();
        queryClient.invalidateQueries();
      },
    });
  };

  return (
    <>
      <Button variant="filled" color="red" leftSection={<IconTrash size={16} />} onClick={open}>
        Delete Account
      </Button>
      <Modal opened={opened} onClose={close} title="Delete account">
        <form onSubmit={form.onSubmit(handleDelete)}>
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text size="sm">
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              All your data will be permanently deleted.
              <List>
                <List.Item fz="xs">Profile</List.Item>
                <List.Item fz="xs">Lists</List.Item>
                <List.Item fz="xs"> Settings</List.Item>
              </List>
            </Text>
          </Alert>
          <Paper p="md" withBorder shadow="md" radius="md" mt="md">
            <Text size="sm" fw="normal" c="dimmed" ta="center" mb="xs">
              Enter your email <b>{user?.email}</b> to confirm
            </Text>
            <TextInput
              variant="filled"
              {...form.getInputProps('email')}
              placeholder="Enter your email"
            />
          </Paper>

          <Group justify="flex-end" mt="md" gap="xs">
            <Button
              variant="filled"
              color="red"
              leftSection={<IconTrash size={16} />}
              type="submit"
              loading={isDeleting}
              disabled={!form.isValid()}
            >
              Delete Account
            </Button>
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};

const UserSettings: React.FC = () => {
  const { isAnonymous, logout, login } = useUserStore();
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();
  const { closeAllModals } = useModalStore();

  // mutations
  const { mutate: createAnonymous } = useCreateAnonymous();

  // handles
  const handleLogout = () => {
    logout();
    createAnonymous(undefined, {
      onSuccess: (data) => {
        login(data.user, data.session);
        closeAllModals();
        queryClient.invalidateQueries();
      },
    });
  };
  return (
    <Stack gap="xs">
      {!isAnonymous && (
        <Group justify="flex-end">
          <Button
            justify="flex-start"
            variant="subtle"
            color="red"
            leftSection={<IconLogout2 size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
          <DeleteAccount />
        </Group>
      )}
      <EditableUser />
      {!isAnonymous && <EditablePasswordInput />}
      {isAnonymous && (
        <>
          <Divider my="md" />
          <Title order={5}>Sign in with</Title>
          <Button variant="light" onClick={() => openModal('auth')}>
            Log in/Sign up
          </Button>
        </>
      )}
    </Stack>
  );
};

const GeneralSettings: React.FC = () => {
  const { selectedTheme, setTheme } = useSettingsStore();
  const { setColorScheme } = useMantineColorScheme();

  // handlers
  const handleSetTheme = (theme: Theme) => {
    setTheme(theme);
    setColorScheme(theme.scheme as 'light' | 'dark');
  };

  // TODO: Add notification functionality in the future

  return (
    <Stack gap="xl">
      <Checkbox.Group label="Theme" description="Choose the theme you want to use">
        <Flex gap="xs" pt="xs">
          {themes.map((theme) => (
            <ActionIcon
              key={theme.id}
              size="md"
              radius="xl"
              color={theme.id === selectedTheme.id ? 'violet' : 'gray'}
              onClick={() => handleSetTheme(theme)}
              variant="outline"
              bg={theme.scheme === 'dark' ? 'dark.5' : 'gray.2'}
            >
              <Paper w={14} h={14} bg={theme.color} radius="xl" />
            </ActionIcon>
          ))}
        </Flex>
      </Checkbox.Group>

      {/* <Switch
        defaultChecked
        label="Enable Notifications"
        description="Toggle to enable or disable notifications"
        
        disabled={!notificationsEnabled}
        checked={notificationsEnabled}

      /> */}

      {/* <Paper component={Group} withBorder p="sm" justify="space-between">
        <Box>
          <Title order={4} fz="sm">
            Install PWA
          </Title>
          <Text size="sm" c="dimmed">
            Add the app to your device for a better experience.
          </Text>
        </Box>

        <Button variant="filled" rightSection={<IconDownload size={16} />}>
          Install Now
        </Button>
      </Paper> */}
    </Stack>
  );
};

const ListsSettings: React.FC = () => {
  const {
    currency,
    setCurrency,
    setShowCategories,
    setShowQuantities,
    setShowPrice,
    setShowSuggestions,
    showCategories,
    showPrice,
    showQuantities,
    showSuggestions,
  } = useSettingsStore();
  return (
    <Stack gap="lg">
      <Select
        label="Currency"
        description="Choose the currency you want to use"
        defaultValue="br"
        value={currency}
        onChange={(value) => setCurrency(value || 'br')}
        data={currencies}
      />
      <Switch
        defaultChecked
        label="Display Prices"
        description="Toggle to show or hide item prices in the list"
        onChange={(event) => setShowPrice(event.currentTarget.checked)}
        checked={showPrice}
      />
      <Switch
        defaultChecked
        label="Display Categories"
        description="Toggle to show or hide item categories in the list"
        onChange={(event) => setShowCategories(event.currentTarget.checked)}
        checked={showCategories}
      />
      <Switch
        defaultChecked
        label="Display Quantities"
        description="Toggle to show or hide item quantities in the list"
        onChange={(event) => setShowQuantities(event.currentTarget.checked)}
        checked={showQuantities}
      />
      <Switch
        disabled
        defaultChecked
        label="Enable Price Suggestions"
        description="Automatically suggest prices for items"
        onChange={(event) => setShowSuggestions(event.currentTarget.checked)}
        checked={showSuggestions}
      />
    </Stack>
  );
};

const About: React.FC = () => {
  // Todo: Add changelog in the future
  const changeLog = [
    {
      version: '1.0.0',
      date: new Date('2023-03-02'),
      description: 'Initial release',
      changes: ['Initial release'],
    },
  ];

  return (
    <Stack>
      <Box>
        <Title order={5}>Version</Title>
        <Badge>1.0.0</Badge>
      </Box>
      <Box>
        <Title order={5}>Developer</Title>
        <Text size="sm" c="dimmed">
          G Fernandes
        </Text>
      </Box>
      <Box>
        <Title order={5}>Changelog</Title>
        <List>
          {changeLog.map((change) => (
            <List.Item key={change.version}>
              <Badge fw="bold">{change.version}</Badge>
              <Text size="sm" c="dimmed" mt="xs">
                {change.description}
              </Text>
              <List size="sm" mt="xs" withPadding>
                {change.changes.map((change) => (
                  <List.Item key={change}>{change}</List.Item>
                ))}
              </List>
            </List.Item>
          ))}
        </List>
      </Box>
    </Stack>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const [tab, setTab] = useState<(typeof menus)[number]['value']>('general');

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { logout, login } = useUserStore();
  const { closeAllModals } = useModalStore();

  // mutations
  const { mutate: createAnonymous } = useCreateAnonymous();

  // handles
  const handleLogout = () => {
    logout();
    createAnonymous(undefined, {
      onSuccess: (data) => {
        login(data.user, data.session);
        closeAllModals();
        navigate('/explore');
        queryClient.invalidateQueries();
      },
    });
  };

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
      {menus.find((menu) => menu.value === option.value)?.icon}
      {option.label}
      {checked && <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />}
    </Group>
  );

  return (
    <Modal size="lg" title="Settings" {...props}>
      <Select
        data={menus}
        renderOption={renderSelectOption}
        value={tab}
        onChange={(value) => setTab((value as (typeof menus)[number]['value']) || 'general')}
        display={{ base: 'block', md: 'none' }}
        mb="md"
      />
      <Flex gap="md" mih={{ base: '60vh', md: '70vh' }} direction={{ base: 'column', md: 'row' }}>
        <Stack justify="space-between" display={{ base: 'none', md: 'flex' }}>
          <Stack w="200" gap="xxs">
            {menus.map((menu) => (
              <Button
                key={menu.value}
                justify="flex-start"
                variant={tab === menu.value ? 'filled' : 'subtle'}
                leftSection={menu.icon}
                fullWidth
                onClick={() => setTab(menu.value)}
              >
                {menu.label}
              </Button>
            ))}
          </Stack>
          <Button
            justify="flex-start"
            variant="subtle"
            color="red"
            leftSection={<IconLogout2 size={16} />}
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
        <Paper style={{ flex: 1 }}>
          <Title order={4}>{menus.find((m) => m.value === tab)?.label}</Title>
          <Divider my="sm" />

          {tab === 'about' && <About />}
          {tab === 'account' && <UserSettings />}
          {tab === 'general' && <GeneralSettings />}
          {tab === 'lists' && <ListsSettings />}
        </Paper>
      </Flex>
    </Modal>
  );
};
