import React from 'react';
import {
  IconCheck,
  IconInfoCircle,
  IconList,
  IconLogout2,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  ModalProps,
  Paper,
  Select,
  SelectProps,
  Stack,
  Title,
} from '@mantine/core';
import { useCreateAnonymous } from '@/service/queries/user';
import useModalStore from '@/store/modalStore';
import useUserStore from '@/store/userStore';

type SettingsModalProps = {} & ModalProps;

export const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const queryClient = useQueryClient();

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
        queryClient.invalidateQueries();
      },
    });
  };

  const iconProps = {
    stroke: 1.5,
    color: 'currentColor',
    opacity: 0.6,
    size: 18,
  };

  const icons: Record<string, React.ReactNode> = {
    general: <IconList {...iconProps} />,
    account: <IconUser {...iconProps} />,
    settings: <IconSettings {...iconProps} />,
    about: <IconInfoCircle {...iconProps} />,
  };

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex="1" gap="xs">
      {icons[option.value]}
      {option.label}
      {checked && <IconCheck style={{ marginInlineStart: 'auto' }} {...iconProps} />}
    </Group>
  );

  return (
    <Modal size="xl" title="Settings" {...props}>
      <Flex gap="md" mih="70vh" direction={{ base: 'column', md: 'row' }}>
        <Stack justify="space-between">
          <Select
            display="none"
            data={[
              { value: 'general', label: 'General' },
              { value: 'account', label: 'Account' },
              { value: 'settings', label: 'Settings' },
              { value: 'about', label: 'About' },
            ]}
            defaultValue="general"
            renderOption={renderSelectOption}
          />
          <Stack w="200" gap="xxs">
            <Button
              justify="flex-start"
              variant="filled"
              leftSection={<IconList size={16} />}
              fullWidth
            >
              General
            </Button>
            <Button
              justify="flex-start"
              variant="subtle"
              leftSection={<IconUser size={16} />}
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
              leftSection={<IconInfoCircle size={16} />}
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
            onClick={handleLogout}
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
  );
};
