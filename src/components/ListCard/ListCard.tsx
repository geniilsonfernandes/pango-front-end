import { useMemo } from 'react';
import { IconMenu, IconShare, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  AvatarGroup,
  Box,
  Card,
  Flex,
  Group,
  Menu,
  Progress,
  Text,
  Title,
} from '@mantine/core';
import { List } from '@/service/api';
import { calculateStatus } from '@/utils/calculateStatus';
import classes from './ListCard.module.css';

type ListCardProps = {
  list?: List;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
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
  onShare,
  ...props
}) => {
  const status = useMemo(() => {
    return calculateStatus([]);
  }, []);

  return (
    <Card className={classes.card} {...props}>
      <Flex align="center" justify="space-between">
        <Box>
          <Title order={3} fz="h5">
            {list?.title}
          </Title>
          <Text size="xs" c="dimmed" fz="xs">
            {status?.checked || 0} / {0} items
          </Text>
        </Box>

        <Group>
          <AvatarGroup>
            <Avatar
              size="sm"
              src="https://images.unsplash.com/photo-1612838320302-47e0f8e0d7a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
            />
            <Avatar
              size="sm"
              src="https://images.unsplash.com/photo-1612838320302-47e0f8e0d7a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
            />
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
              <Menu.Item onClick={stopPropagation(onShare)} leftSection={<IconShare size={14} />}>
                Shared
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
      <Progress value={(status?.checked / status?.total) * 100} mt="xs" />
    </Card>
  );
};
