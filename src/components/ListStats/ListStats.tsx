import { useMemo } from 'react';
import { Card, Flex, Progress } from '@mantine/core';
import { ListDTO, ShoppingItem } from '@/service/api';
import { calculateStatus } from '@/utils/calculateStatus';
import { CurrencyMode, formatCurrency } from '@/utils/formatCurrency';
import { DisplayValue } from '../DisplayValue/DisplayValue';

type ListStatsProps = {
  list: ListDTO;
  products: ShoppingItem[];
  currencyMode?: CurrencyMode;
};

export const ListStats: React.FC<ListStatsProps> = ({ list, products, currencyMode = 'br' }) => {
  const status = useMemo(() => {
    return calculateStatus(products);
  }, [products]);

  return (
    <Card p="sm">
      <Flex gap="lg" justify="space-between">
        <DisplayValue
          value={` ${status?.checked} / ${status?.total}`}
          label="Total Items"
          aria-label="Total Items"
        />
        <Flex gap="lg" justify="flex-end" align="center">
          <DisplayValue
            value={formatCurrency(list.budget || 0, currencyMode)}
            label="Budget"
            aria-label="Budget"
          />
          <DisplayValue
            value={formatCurrency(status?.checkedPrice || 0, currencyMode)}
            label="Checked"
            aria-label="Checked"
          />
          <DisplayValue
            value={formatCurrency(status?.uncheckedPrice || 0, currencyMode)}
            label="Unchecked"
            aria-label="Unchecked"
          />
        </Flex>
      </Flex>
      <Progress mt="xs" value={(status?.checked / status?.total) * 100} size="xs" />
    </Card>
  );
};
