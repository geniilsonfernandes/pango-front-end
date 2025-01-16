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

  const budget = list.budget || 0;
  const checkedPrice = formatCurrency(status?.checkedPrice || 0, currencyMode);
  const uncheckedPrice = formatCurrency(status?.uncheckedPrice || 0, currencyMode);
  const budgetFormatted = formatCurrency(list.budget || 0, currencyMode);

  const isOverBudget = (status?.checkedPrice || 0) <= (budget || 0);

  return (
    <Card p="sm" bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))">
      <Flex gap="lg" justify="space-between">
        <DisplayValue
          value={` ${status?.checked} / ${status?.total}`}
          label="Total Items"
          aria-label="Total Items"
        />
        <Flex gap="lg" justify="flex-end" align="center">
          <DisplayValue value={budgetFormatted} label="Budget" aria-label="Budget" />
          <DisplayValue value={checkedPrice} label="Checked" aria-label="Checked" />
          <DisplayValue value={uncheckedPrice} label="Unchecked" aria-label="Unchecked" />
        </Flex>
      </Flex>
      <Progress
        mt="xs"
        value={(status?.checked / status?.total) * 100}
        color={isOverBudget ? 'green' : 'red'}
        size="xs"
      />
    </Card>
  );
};
