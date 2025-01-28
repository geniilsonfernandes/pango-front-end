import {
  IconCopy,
  IconCurrencyDollar,
  IconEdit,
  IconMenu,
  IconPrinter,
  IconShare,
  IconTrash,
} from '@tabler/icons-react';
import { ActionIcon, Group, Menu, rem } from '@mantine/core';
import { useSettingsStore } from '@/store/settingsStore';

type ListActionsProps = {
  onDelete: () => void;
  onEdit: () => void;
  onShare: () => void;
  onPrint: () => void;
  onCopy: () => void;
  isOwner?: boolean;
};
export const ListActions: React.FC<ListActionsProps> = ({
  onDelete,
  onEdit,
  onShare,
  onPrint,
  onCopy,
  isOwner,
}) => {
  const { showPrice, setShowPrice } = useSettingsStore();

  return (
    <Group gap="xs">
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
            disabled={!isOwner}
          >
            Edit
          </Menu.Item>

          <Menu.Item
            leftSection={<IconShare style={{ width: rem(14), height: rem(14) }} />}
            onClick={onShare}
            disabled={!isOwner}
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
            disabled={!isOwner}
          >
            Delete list
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};
