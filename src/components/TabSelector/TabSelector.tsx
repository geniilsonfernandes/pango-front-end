import { Button, Stack } from '@mantine/core';

type TabSelectorProps = {
  tab: string;
  toggleTab: (tab: string) => void;
  options: string[];
};

export const TabSelector: React.FC<TabSelectorProps> = ({ tab, toggleTab, options }) => (
  <Stack gap="xxs">
    <Stack gap="xs">
      {options.map((label) => (
        <Button
          key={label}
          size="compact-xs"
          radius="xl"
          variant={label === tab ? 'filled' : 'outline'}
          onClick={() => toggleTab(label)}
        >
          {label}
        </Button>
      ))}
    </Stack>
  </Stack>
);
