import { useParams } from 'react-router-dom';
import { Card, Center, Loader, rem } from '@mantine/core';
import { List } from '@/components/List/List';
import { ListManager } from '@/components/ListManager/ListManager';
import { useListItems } from '@/service/queries/useList';

type Params = {
  id: string;
};

export function HomePage() {
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
    <>
      <List list={list.data} products={products.data || []} />
      <ListManager products={products.data} list={list.data} />
    </>
  );
}
