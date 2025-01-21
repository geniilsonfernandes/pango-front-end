import { IconChevronRight, IconLogin2, IconUser } from '@tabler/icons-react';
import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { User } from '@/service/models/types';
import classes from './UserButton.module.css';

type UserButtonProps = {
  user?: User;
} & React.HtmlHTMLAttributes<HTMLButtonElement>;
export const UserButton: React.FC<UserButtonProps> = ({ user, ...props }) => {
  return (
    <UnstyledButton variant="subtle" className={classes.user} {...props}>
      {user ? (
        <Group>
          {/* <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
          radius="xl"
          /> */}

          <ThemeIcon variant="light" size={32} radius="xl">
            <IconUser size={20} />
          </ThemeIcon>

          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {user?.name || user?.email}
            </Text>

            <Text c="dimmed" size="xs">
              {user?.email}
            </Text>
          </div>

          <IconChevronRight size={14} stroke={1.5} />
        </Group>
      ) : (
        <Group>
          <ThemeIcon variant="light" size={32} radius="xl">
            <IconLogin2 size={20} />
          </ThemeIcon>
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              Login / Sign Up
            </Text>

            <Text c="dimmed" size="xs">
              To access all features
            </Text>
          </div>
        </Group>
      )}
    </UnstyledButton>
  );
};
