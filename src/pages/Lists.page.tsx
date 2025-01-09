import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Grid, Modal, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ListCard } from '@/components/ListCard/ListCard';
import { ListForm } from '@/components/ListForm/ListForm';
import { MonthSelect } from '@/components/MonthSelect/MonthSelect';
import { useCalendar } from '@/hooks/useCalendar';
import { ListDTO } from '@/service/api';
import { useLists } from '@/service/queries/useLists';

export const ListsPage = () => {
  const { data } = useLists();
  const navigate = useNavigate();
  const { currentDate, setValue, nextMonth, previousMonth, formattedMonth } = useCalendar();
  const [listSelected, setListSelected] = useState<ListDTO>();
  const [opened, { open, close }] = useDisclosure();

  const handleClose = () => {
    setListSelected(undefined);
    close();
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
          onClick={open}
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
                open();
              }}
              onDelete={() => {
                console.log('delete');
              }}
              onShare={() => {
                console.log('share');
              }}
            />
          </Grid.Col>
        ))}
      </Grid>

      <Modal
        opened={opened}
        onClose={handleClose}
        title={listSelected ? 'Edit list' : 'Create list'}
      >
        <ListForm onCancel={handleClose} data={listSelected} />
      </Modal>
    </Stack>
  );
};
