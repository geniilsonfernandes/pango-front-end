import { useQueries, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Card, Center, Loader, rem } from '@mantine/core';
import { List } from '@/components/List/List';
import { ListManager } from '@/components/ListManager/ListManager';
import { ListDTO, shoppingAPI } from '@/service/api';
import { listQueryKeys } from '@/service/queries/useLists';

type Params = {
  id: string;
};

export function HomePage() {
  const { id } = useParams<Params>();
  const queryClient = useQueryClient();
  const results = useQueries({
    queries: [
      {
        queryKey: listQueryKeys.getList(id),
        queryFn: () => shoppingAPI.getList(id),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        initialData: () => {
          const shoppingList = queryClient.getQueryData(listQueryKeys.list()) as
            | ListDTO[]
            | undefined;

          return shoppingList?.find((item) => item.id === id);
        },
      },
      {
        queryKey: listQueryKeys.listItems(id),
        queryFn: () => shoppingAPI.getlistItems(id),
      },
    ],
  });

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