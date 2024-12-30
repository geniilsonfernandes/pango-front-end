import { Flex, Paper } from '@mantine/core';
import { List } from '@/components/List/List';
import { ListManager } from '@/components/ListManager/ListManager';
import { SideNavigation } from '@/components/SideNavigation/SideNavigation';

export function HomePage() {
  return (
    <Flex
      component={Paper}
      style={{
        backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
      }}
      direction="column"
      px="gr"
      gap="sm"
      py="xl"
    >
      <Flex gap="lg" flex={1}>
        <SideNavigation initialValue={0} step={1} />
        <List />
        <ListManager />
      </Flex>
    </Flex>
  );
}
