import { useParams } from 'react-router-dom';
import { Box, Card, Center, Flex, Loader, rem, Stack } from '@mantine/core';
import { Header, List } from '@/components/List/List';
import { ListManager } from '@/components/ListManager/ListManager';
import { useListItems } from '@/service/queries/list';

type Params = {
  id: string;
};

export function ListPage() {
  const { id } = useParams<Params>();

  const results = useListItems(id);

  const [list, products] = results;

  if (list.isLoading || products.isLoading) {
    return (
      <Center flex={1} h={rem(400)}>
        <Loader />
      </Center>
    );
  }

  if (!list.data || !products.data) {
    return (
      <Center flex={1} h={rem(400)}>
        <Card p="md" radius="md" withBorder>
          List not found
        </Card>
      </Center>
    );
  }

  return (
    <Flex flex={1}>
      <Stack flex={1} gap={0}>
        <Header list={list.data} products={products.data} />
        <List list={list.data} products={products.data || []} />
      </Stack>
      <Box
        h="100vh"
        p="md"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <ListManager products={products.data} list={list.data} />
      </Box>
    </Flex>
  );
}
