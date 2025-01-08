import { useMemo } from 'react';
import { create } from 'zustand';
import { Box, Flex, Stack, Text, Title } from '@mantine/core';
import { ShoppingItem } from '@/service/api';
import { ListActions } from '../ListActions/ListActions';
import { ListStats } from '../ListStats/ListStats';

interface ListHeaderState {
  showPrice: boolean;
  setShowPrice: (showStats: boolean) => void;
}

export const useListHeaderStore = create<ListHeaderState>((set) => ({
  showPrice: false,
  setShowPrice: (showPrice) => set({ showPrice }),
}));

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
  budget = 0,
}) => {
  const { showPrice } = useListHeaderStore();

  const status = useMemo(() => {
    return data?.reduce(
      (acc, cur) => {
        return {
          checked: acc.checked + (cur.checked ? 1 : 0),
          checkedPrice: acc.checkedPrice + (cur.checked ? cur.price || 0 : 0),
          unchecked: acc.unchecked + (cur.checked ? 0 : 1),
          uncheckedPrice: acc.uncheckedPrice + (cur.checked ? 0 : cur.price || 0),
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
        <ListStats
          totalItems={`${status?.checked} / ${status?.total}`}
          budget={`${budget}`}
          checked={`$${status?.checkedPrice}`}
          unchecked={`$${status?.uncheckedPrice}`}
          progress={status?.total ? (status.checked / status.total) * 100 : 0}
        />
      )}
    </Stack>
  );
};
