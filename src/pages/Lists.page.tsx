import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Grid, Modal, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ListCard } from '@/components/ListCard/ListCard';
import { List, ListForm } from '@/components/ListForm/ListForm';
import { MonthSelect } from '@/components/MonthSelect/MonthSelect';
import { useCalendar } from '@/hooks/useCalendar';

const list: List[] = [
  {
    id: '1',
    name: 'Banana',
    badge: '1',
    date: '2023-05-01',
    description: 'Banana',
    items: [],
  },
  {
    id: '2',
    name: 'Banana',
    badge: '1',
    date: '2023-05-01',
    description: 'Banana',
    items: [],
  },
  {
    id: '3',
    name: 'Banana',
    badge: '1',
    date: '2023-05-01',
    description: 'Banana',
    items: [],
  },
];

export const ListsPage = () => {
  const navigate = useNavigate();
  const { currentDate, setValue, nextMonth, previousMonth, formattedMonth } = useCalendar();
  const [listSelected, setListSelected] = useState<List>();
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
        {list.map((item) => (
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
