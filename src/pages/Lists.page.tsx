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
import { useDeleteList, useList } from '@/service/queries/list';

export const ListsPage = () => {
  const { data } = useList();
  const navigate = useNavigate();
  const { currentDate, setValue, nextMonth, previousMonth, formattedMonth } = useCalendar();
  const [listSelected, setListSelected] = useState<ListDTO>();

  const [openedDelete, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [openedList, { open: openListModal, close: closeListModal }] = useDisclosure();

  // Mutations
  const { mutate: deleteList, isLoading: isDeleting } = useDeleteList();

  // Handles
  const handleCloseList = () => {
    setListSelected(undefined);
    closeListModal();
  };

  const handleDelete = () => {
    if (listSelected?.id) {
      setListSelected(undefined);
      deleteList(listSelected.id);
      closeDeleteModal();
    }
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
          onClick={openListModal}
        >
          Create a new list
        </Button>
      </Flex>
      <Grid>
        {data?.map((list) => (
          <Grid.Col key={list.id} span={6}>
            <ListCard
              list={list}
              onClick={() => {
                navigate(`/shopping-lists/${list.id}`);
              }}
              onEdit={() => {
                setListSelected(list);
                openListModal();
              }}
              onDelete={() => {
                setListSelected(list);
                openDeleteModal();
              }}
              onShare={() => {
                console.log('share');
              }}
            />
          </Grid.Col>
        ))}
      </Grid>

      <Modal opened={openedList} onClose={handleCloseList} title="Create a new list">
        <ListForm list={listSelected} onCancel={handleCloseList} />
      </Modal>
      <DeleteConfirmation
        opened={openedDelete}
        onClose={closeDeleteModal}
        isDeleting={isDeleting}
        onDeleteList={handleDelete}
      />
    </Stack>
  );
};
