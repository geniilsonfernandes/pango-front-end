import { IconPlus } from '@tabler/icons-react';
import { Button, Flex, Grid, Stack, Title } from '@mantine/core';
import { ListCard } from '@/components/ListCard/ListCard';
import { MonthSelect } from '@/components/MonthSelect/MonthSelect';
import { useCalendar } from '@/hooks/useCalendar';

export const ListsPage = () => {
  const { currentDate, setValue, nextMonth, previousMonth, formattedMonth } = useCalendar();

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
          onClick={() => {}}
        >
          Create a new list
        </Button>
      </Flex>
      <Grid>
        <Grid.Col span={12}>
          <ListCard />
        </Grid.Col>
        <Grid.Col span={12}>
          <ListCard />
        </Grid.Col>
        <Grid.Col span={12}>
          <ListCard />
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
