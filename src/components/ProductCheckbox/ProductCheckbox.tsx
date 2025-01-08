import React, { useMemo, useState } from 'react';
import { Button, Card, Checkbox, CheckboxProps, Group, Text, Title, Tooltip } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { ShoppingItem } from '@/service/api';
import { CurrencyMode, formatCurrency } from '@/utils/formatCurrency';
import classes from './ProductCheckbox.module.css';

export type ProductCheckboxProps = {
  name: string;
  shoppingItem?: ShoppingItem;
  currency?: CurrencyMode;
  showPrice?: boolean;
  onCheck?: () => void;
  checked?: boolean;
  onPriceClick?: () => void;
  onClick?: () => void;
} & CheckboxProps;

export const ProductCheckbox: React.FC<ProductCheckboxProps> = ({
  checked = false,
  opacity,
  name,
  shoppingItem,
  currency = 'br',
  showPrice = false,
  onPriceClick,
  onCheck,
  onClick,
}) => {
  const [check, setCheck] = useState(checked);

  const value = useMemo(() => {
    if (shoppingItem) {
      return formatCurrency((shoppingItem.quantity || 0) * (shoppingItem.price || 0), currency);
    }
    return 0;
  }, [currency, shoppingItem]);

  const handleSearch = useDebouncedCallback(() => {
    onCheck?.();
  }, 500);

  const handleCheck = () => {
    setCheck(!check);
    handleSearch();
  };

  return (
    <Card opacity={opacity} className={classes.card} onClick={onClick}>
      <Group gap="xs">
        <Tooltip label={checked ? 'Remove' : 'Add'}>
          <Checkbox
            radius="md"
            checked={check}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              handleCheck();
            }}
          />
        </Tooltip>
        <Title order={3} fz="sm" fw={500}>
          {name}
        </Title>
      </Group>
      <Group gap="xs">
        <Text c="dimmed" fz="xs" pl="xs" fw={500}>
          {shoppingItem?.quantity}
        </Text>
        {shoppingItem?.unit && (
          <Button
            c="gray"
            fz="xs"
            fw="bolder"
            size="compact-xs"
            variant="light"
            color="gray"
            radius="sm"
            onClick={onPriceClick}
          >
            {shoppingItem?.unit}
          </Button>
        )}
        {showPrice && (
          <Button
            c="gray"
            fz="xs"
            fw="bolder"
            size="compact-xs"
            variant="light"
            color="gray"
            radius="sm"
            onClick={onPriceClick}
          >
            {value}
          </Button>
        )}
      </Group>
    </Card>
  );
};
