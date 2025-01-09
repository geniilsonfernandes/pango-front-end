import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Box, Flex, Progress, Stack, Text, Title } from '@mantine/core';
import { ShoppingItem } from '@/service/api';
import { ListActions } from '../ListActions/ListActions';
import { ListStats } from '../ListStats/ListStats';

interface ListHeaderState {
  showPrice: boolean;
  setShowPrice: (showPrice: boolean) => void;
}

export const useListHeaderStore = create<ListHeaderState>()(
  persist(
    (set) => ({
      showPrice: false,
      setShowPrice: (showPrice) => set({ showPrice }),
    }),
    {
      name: 'list-header-store', // Nome da chave no localStorage
    }
  )
);

type ListHeaderProps = {
  listName: string;
  createdAt: string;
  data?: ShoppingItem[];
  budget?: number;
};

const HeaderDetails: React.FC<{ listName: string; createdAt: string }> = ({
  listName,
  createdAt,
}) => (
  <Box>
    <Title order={1} fz="xl">
      {listName}
    </Title>
    <Text fz="xs" fw={400} c="dimmed">
      {createdAt}
    </Text>
  </Box>
);

export const ListHeader: React.FC<ListHeaderProps> = ({
  createdAt,
  listName,
  data,
  budget = 300,
}) => {
  const { showPrice } = useListHeaderStore();

  const status = useMemo(() => {
    if (!data) {
      return {
        checked: 0,
        checkedPrice: 0,
        unchecked: 0,
        uncheckedPrice: 0,
        total: 0,
      };
    }
    return data?.reduce(
      (acc, cur) => {
        const price = (cur?.price || 0) * (cur.quantity || 1);
        return {
          checked: acc.checked + (cur.checked ? 1 : 0),
          checkedPrice: acc.checkedPrice + (cur.checked ? price : 0),
          unchecked: acc.unchecked + (cur.checked ? 0 : 1),
          uncheckedPrice: acc.uncheckedPrice + (cur.checked ? 0 : price || 0),
          total: acc.total + 1,
        };
      },
      {
        checked: 0,
        checkedPrice: 0,
        unchecked: 0,
        uncheckedPrice: 0,
        total: 0,
      }
    );
  }, [data]);

  return (
    <Stack gap="xs" mb="xs">
      <Flex justify="space-between" align="center">
        <HeaderDetails listName={listName} createdAt={createdAt} />
        <ListActions />
      </Flex>
      {showPrice && (
        <>
          <ListStats
            totalItems={`${status?.checked} / ${status?.total}`}
            budget={`${budget}`}
            checked={`${status?.checkedPrice}`}
            unchecked={`${status?.uncheckedPrice}`}
          />
          <Progress
            value={status?.total ? (status.checked / status.total) * 100 : 0}
            color={budget < status?.checkedPrice ? 'red' : 'green'}
            style={{ width: '100%' }}
          />
        </>
      )}
    </Stack>
  );
};
