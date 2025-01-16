import {
  IconClipboardList,
  IconLayoutSidebarLeftCollapseFilled,
  IconSettings,
  IconTrash,
  IconWorldSearch,
} from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { ActionIcon, Box, Button, Divider, Paper, rem, Stack } from '@mantine/core';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { Logo } from '../Logo/Logo';
import { UserButton } from '../UserButton/UserButton';

export type SideNavigationProps = {
  initialValue: number;
  step: number;
};

export const SideNavigation: React.FC<SideNavigationProps> = () => {
  return (
    <Paper
      component="aside"
      w={300}
      h="calc(100vh - 64px)"
      style={{ position: 'sticky', top: 32 }}
      withBorder
      shadow="md"
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
        radius="xl"
        aria-expanded="true"
        aria-controls="sidebar-content"
        style={{ position: 'absolute', top: rem(18), right: rem(-10) }}
      >
        <IconLayoutSidebarLeftCollapseFilled size={18} stroke={1} />
      </ActionIcon>

      <Stack gap="xxs" p="xs" component="nav" aria-label="Main navigation">
        <Box p="xs">
          <Logo />
        </Box>
        <NavLink to="/shopping-lists" style={{ width: '100%', textDecoration: 'none' }}>
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
        <Button
          variant="subtle"
          color="gray"
          styles={{
            label: {
              width: '100%',
            },
          }}
          px="xxs"
          leftSection={<IconTrash width={rem(14)} stroke={1} />}
        >
          Trash
        </Button>
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
        >
          Settings
        </Button>
      </Stack>

      <Stack gap="xxs">
        <ColorSchemeToggle />
        <UserButton />
      </Stack>
    </Paper>
  );
};
