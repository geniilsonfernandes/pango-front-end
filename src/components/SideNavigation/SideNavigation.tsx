import {
  IconClipboardList,
  IconLayoutSidebarLeftCollapseFilled,
  IconLayoutSidebarRightCollapseFilled,
  IconSettings,
  IconTrash,
  IconWorldSearch,
} from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { ActionIcon, Box, Button, Divider, Paper, rem, Stack } from '@mantine/core';
import useModalStore from '@/store/modalStore';
import useUserStore from '@/store/userStore';
import { Logo } from '../Logo/Logo';
import { UserButton } from '../UserButton/UserButton';

type SideNavigationProps = {
  onCollapse: () => void;
  collapsed: boolean;
};

export const SideNavigation: React.FC<SideNavigationProps> = ({ collapsed, onCollapse }) => {
  const { openModal } = useModalStore();
  const { user, isAnonymous } = useUserStore();

  return (
    <Paper
      component="aside"
      pos="relative"
      w="100%"
      h="100%"
      withBorder
      aria-expanded
      styles={{
        root: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <ActionIcon
        variant="filled"
        size="lg"
        aria-expanded={collapsed}
        aria-controls="sidebar-content"
        style={{ position: 'absolute', top: rem(18), right: rem(-14) }}
        onClick={onCollapse}
      >
        {!collapsed ? (
          <IconLayoutSidebarLeftCollapseFilled size={22} stroke={1} />
        ) : (
          <IconLayoutSidebarRightCollapseFilled size={22} stroke={1} />
        )}
      </ActionIcon>

      <Stack gap="xxs" p="xs" component="nav" aria-label="Main navigation">
        <Box p="xs">
          <Logo />
        </Box>
        <NavLink to="/" style={{ width: '100%', textDecoration: 'none' }}>
          {({ isActive }) => (
            <Button
              variant={isActive ? 'filled' : 'subtle'}
              fullWidth
              styles={{
                label: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                },
              }}
              component="span"
              px="xxs"
              aria-current={isActive ? 'page' : undefined}
              leftSection={<IconClipboardList width={rem(14)} stroke={1} />}
            >
              Shopping lists
            </Button>
          )}
        </NavLink>
        <NavLink to="/explore" style={{ width: '100%', textDecoration: 'none' }}>
          {({ isActive }) => (
            <Button
              variant={isActive ? 'filled' : 'subtle'}
              fullWidth
              styles={{
                label: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                },
              }}
              component="span"
              px="xxs"
              aria-current={isActive ? 'page' : undefined}
              leftSection={<IconWorldSearch width={rem(14)} stroke={1} />}
            >
              Explore
            </Button>
          )}
        </NavLink>

        <Divider my="md" />

        <NavLink to="/trash" style={{ width: '100%', textDecoration: 'none' }}>
          {({ isActive }) => (
            <Button
              variant={isActive ? 'filled' : 'subtle'}
              fullWidth
              styles={{
                label: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                },
              }}
              component="span"
              px="xxs"
              aria-current={isActive ? 'page' : undefined}
              leftSection={<IconTrash width={rem(14)} stroke={1} />}
            >
              Trash
            </Button>
          )}
        </NavLink>
        <Button
          variant="subtle"
          color="gray"
          styles={{
            label: {
              width: '100%',
            },
          }}
          px="xxs"
          leftSection={<IconSettings width={rem(14)} stroke={1} />}
          onClick={() => openModal('settings')}
        >
          Settings
        </Button>
      </Stack>

      <Stack gap="xxs">
        <UserButton
          user={isAnonymous ? undefined : user}
          onClick={() => openModal(user && !isAnonymous ? 'profile' : 'auth')}
        />
      </Stack>
    </Paper>
  );
};
