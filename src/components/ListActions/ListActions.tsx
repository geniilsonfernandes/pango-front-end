import {
  IconCopy,
  IconCurrencyDollar,
  IconEdit,
  IconMenu,
  IconPrinter,
  IconShare,
  IconTrash,
} from '@tabler/icons-react';
import { ActionIcon, Avatar, AvatarGroup, Group, Menu, rem } from '@mantine/core';
import { useListStore } from '@/store/listStore';

type ListActionsProps = {
  onDelete: () => void;
  onEdit: () => void;
  onShare: () => void;
  onPrint: () => void;
  onCopy: () => void;
};
export const ListActions: React.FC<ListActionsProps> = ({
  onDelete,
  onEdit,
  onShare,
  onPrint,
  onCopy,
}) => {
  const { setShowPrice, showPrice } = useListStore();

  return (
    <Group gap="xs">
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
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle" color="gray">
            <IconMenu size={18} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>List</Menu.Label>
          <Menu.Item
            leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
            onClick={onEdit}
          >
            Edit
          </Menu.Item>
          <Menu.Item
            leftSection={<IconShare style={{ width: rem(14), height: rem(14) }} />}
            onClick={onShare}
          >
            Share
          </Menu.Item>
          <Menu.Item
            leftSection={<IconPrinter style={{ width: rem(14), height: rem(14) }} />}
            onClick={onPrint}
          >
            Print
          </Menu.Item>
          <Menu.Item
            leftSection={<IconCopy style={{ width: rem(14), height: rem(14) }} />}
            onClick={onCopy}
          >
            Make a copy
          </Menu.Item>

          <Menu.Label>Settings</Menu.Label>
          <Menu.Item
            leftSection={<IconCurrencyDollar style={{ width: rem(14), height: rem(14) }} />}
            onClick={() => setShowPrice(!showPrice)}
          >
            {showPrice ? 'Hide' : 'Show'} prices
          </Menu.Item>

          <Menu.Item
            color="red"
            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
            onClick={onDelete}
          >
            Delete list
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};
