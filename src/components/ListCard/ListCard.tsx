import { useMemo } from 'react';
import { IconMenu, IconShare, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Menu,
  Progress,
  Text,
  Title,
} from '@mantine/core';
import { List } from '@/service/models/types';
import { calculateStatus } from '@/utils/calculateStatus';
import classes from './ListCard.module.css';

type ListCardProps = {
  list?: List;
  onEdit?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  onShare?: () => void;
  onRestore?: () => void;
  isRestoring?: boolean;
  type?: 'default' | 'restore';
} & React.ComponentPropsWithoutRef<'div'>;

function stopPropagation(callback?: () => void) {
  return (event: React.MouseEvent) => {
    event.stopPropagation();
    callback?.();
  };
}

export const ListCard: React.FC<ListCardProps> = ({
  list,
  onEdit,
  onDelete,
  isDeleting,
  onShare,
  onRestore,
  isRestoring,
  type = 'default',
  ...props
}) => {
  const status = useMemo(() => {
    return calculateStatus(list?.products);
  }, []);

  return (
    <Card className={classes.card} {...props}>
      <Flex align="center" justify="space-between">
        <Box>
          <Title order={3} fz="h5">
            {list?.title}
          </Title>
          <Text size="xs" c="dimmed" fz="xs">
            {status?.checked || 0} / {status?.total || 0} items
          </Text>
        </Box>

        <Group>
          {type === 'restore' && (
            <>
              <Button.Group>
                <Button
                  variant="outline"
                  color="red"
                  loading={isDeleting}
                  onClick={stopPropagation(onDelete)}
                >
                  Delete
                </Button>
                <Button variant="filled" loading={isRestoring} onClick={stopPropagation(onRestore)}>
                  Restore
                </Button>
              </Button.Group>
            </>
          )}
          {type === 'default' && (
            <>
              <AvatarGroup>
                {list?.shared_with.map((sharedUser) => (
                  <Avatar
                    color="initials"
                    name={sharedUser.user?.name}
                    key={sharedUser.user?.id}
                    size="sm"
                  />
                ))}
              </AvatarGroup>
              <Menu shadow="md" position="left" width={200}>
                <Menu.Target>
                  <ActionIcon ml="auto" variant="default" onClick={stopPropagation()}>
                    <IconMenu size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Actions</Menu.Label>
                  <Menu.Item onClick={stopPropagation(onEdit)} leftSection={<IconMenu size={14} />}>
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    onClick={stopPropagation(onDelete)}
                    leftSection={<IconTrash size={14} />}
                    color="red"
                  >
                    Delete
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    onClick={stopPropagation(onShare)}
                    leftSection={<IconShare size={14} />}
                  >
                    Shared
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </>
          )}
        </Group>
      </Flex>
      <Progress value={(status?.checked / status?.total) * 100} mt="xs" />
    </Card>
  );
};
