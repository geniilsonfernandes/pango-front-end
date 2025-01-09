import { IconEdit, IconMenu, IconShare, IconTrash } from '@tabler/icons-react';
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
import classes from './ListCard.module.css';

export const ListCard = () => {
  return (
    <Card className={classes.card}>
      <Flex align="center" justify="space-between">
        <Box>
          <Title order={3} fz="h5">
            lista de compras
          </Title>
          <Text size="xs" c="dimmed" fz="xs">
            6 / 8 items
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
              <ActionIcon ml="auto" variant="default">
                <IconMenu size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Actions</Menu.Label>
              <Menu.Item leftSection={<IconEdit size={14} />}>Edit</Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                Delete
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconShare size={14} />}>Shared</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Flex>
      <Progress value={50} mt="xs" />
    </Card>
  );
};
