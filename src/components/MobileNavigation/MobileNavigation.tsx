import { IconClipboardList, IconSettings, IconTrash, IconWorldSearch } from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';
import { Button, Flex, Group, Paper, Text } from '@mantine/core';
import useModalStore from '@/store/modalStore';

export const MobileNavigation = () => {
  const { openModal } = useModalStore();

  return (
    <Paper
      p="4"
      pos="fixed"
      withBorder
      bottom={0}
      w="100%"
      style={{
        zIndex: 1000,
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <Flex justify="center">
        <Group>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                size="lg"
                ta="center"
                variant={isActive ? 'filled' : 'subtle'}
                py="4"
                px="8"
                miw={50}
                styles={{
                  label: { flexDirection: 'column', gap: 4 },
                }}
              >
                <IconClipboardList size={22} />
                <Text size="xs">List</Text>
              </Button>
            )}
          </NavLink>

          <NavLink to="/Explore" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                size="lg"
                ta="center"
                variant={isActive ? 'filled' : 'subtle'}
                py="4"
                px="8"
                miw={50}
                styles={{
                  label: { flexDirection: 'column', gap: 4 },
                }}
              >
                <IconWorldSearch size={22} />
                <Text size="xs">Explore</Text>
              </Button>
            )}
          </NavLink>
          <NavLink to="/trash" style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <Button
                size="lg"
                ta="center"
                variant={isActive ? 'filled' : 'subtle'}
                py="4"
                px="8"
                miw={50}
                styles={{
                  label: { flexDirection: 'column', gap: 4 },
                }}
              >
                <IconTrash size={22} />
                <Text size="xs">Trash</Text>
              </Button>
            )}
          </NavLink>

          <Button
            size="lg"
            ta="center"
            variant="subtle"
            py="4"
            px="8"
            miw={50}
            styles={{
              label: { flexDirection: 'column', gap: 4 },
            }}
            onClick={() => openModal('settings')}
          >
            <IconSettings size={22} />
            <Text size="xs">Settings</Text>
          </Button>
        </Group>
      </Flex>
    </Paper>
  );
};
