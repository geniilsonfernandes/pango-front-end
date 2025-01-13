import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Grid, Modal, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ListCard } from '@/components/ListCard/ListCard';
import { DeleteConfirmation, ListForm } from '@/components/ListForm/ListForm';
import { MonthSelect } from '@/components/MonthSelect/MonthSelect';
import { useCalendar } from '@/hooks/useCalendar';
import { ListDTO } from '@/service/api';
import { useDeleteList } from '@/service/mutation/useListMutations';
import { useLists } from '@/service/queries/useLists';

export const ListsPage = () => {
  const { data } = useLists();
  const navigate = useNavigate();
  const { currentDate, setValue, nextMonth, previousMonth, formattedMonth } = useCalendar();
  const [listSelected, setListSelected] = useState<ListDTO>();

  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [openedList, { open: openList, close: closeList }] = useDisclosure();
  const { mutate: deleteList, isLoading: isDeleting } = useDeleteList({
    onSuccess: () => {
      closeDelete();
    },
  });

  const handleCloseList = () => {
    setListSelected(undefined);
    closeList();
  };

  return (
    <Stack flex={1}>
      <Title order={2}> Suas listas de compras</Title>
      <Flex justify="space-between">
        <MonthSelect
          currentDate={currentDate}
          setValue={setValue}
          nextMonth={nextMonth}
          previousMonth={previousMonth}
          formattedMonth={formattedMonth}
        />
        <Button
          variant="filled"
          leftSection={<IconPlus width={16} height={16} strokeWidth={1.5} />}
          onClick={openList}
        >
          Create a new list
        </Button>
      </Flex>
      <Grid>
        {data?.map((item) => (
          <Grid.Col key={item.id} span={6}>
            <ListCard
              data={item}
              onClick={() => {
                navigate(`/shopping-lists/${item.id}`);
              }}
              onEdit={() => {
                setListSelected(item);
                openList();
              }}
              onDelete={() => {
                setListSelected(item);
                openDelete();
              }}
              onShare={() => {
                console.log('share');
              }}
            />
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={openedList}
        onClose={handleCloseList}
        title={listSelected ? 'Edit list' : 'Create list'}
      >
        <ListForm onCancel={handleCloseList} data={listSelected} />
      </Modal>
      <DeleteConfirmation
        opened={openedDelete}
        onClose={closeDelete}
        isDeleting={isDeleting}
        onDeleteList={() => {
          if (listSelected?.id) {
            deleteList(listSelected.id);
          }
        }}
      />
    </Stack>
  );
};
