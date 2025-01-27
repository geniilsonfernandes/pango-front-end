import { Center, Grid, Loader, Stack, Title } from '@mantine/core';
import { ListCard } from '@/components/ListCard/ListCard';
import { useDeleteList, useList, useRestoreList } from '@/service/queries/list';

export const ListsDeletedPage = () => {
  // query
  const { data: lists, isLoading: isListsLoading } = useList({
    deleted: true,
  });

  // Mutations
  const { mutate: deleteList, isLoading: isDeleting } = useDeleteList({
    permanent: true,
  });
  const { mutate: restoreList, isLoading: isRestoring } = useRestoreList();

  // Handles

  if (isListsLoading) {
    return (
      <Center flex={1} h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Stack flex={1} p="md">
      <Title order={2}>Trash</Title>

      <Grid>
        {lists?.map((list) => (
          <Grid.Col
            key={list.id}
            span={{
              base: 12,
              md: 6,
            }}
          >
            <ListCard
              list={list}
              type="restore"
              onDelete={() => {
                deleteList(list.id);
              }}
              onRestore={() => {
                restoreList(list.id);
              }}
              isRestoring={isRestoring}
              isDeleting={isDeleting}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
