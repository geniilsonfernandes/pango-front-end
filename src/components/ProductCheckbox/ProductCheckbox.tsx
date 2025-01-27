import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { Product } from '@/service/models/types';
import { formatCurrency } from '@/utils/formatCurrency';
import classes from './ProductCheckbox.module.css';

export type ProductCheckboxProps = {
  name: string;
  product?: Product;
  currency?: string;
  showPrice?: boolean;
  onCheck?: () => void;
  checked?: boolean;
  onPriceClick?: () => void;
  onClick?: () => void;
  showQuantities: boolean;
  showCategories: boolean;
} & CheckboxProps;

export const ProductCheckbox: React.FC<ProductCheckboxProps> = ({
  checked = false,
  opacity,
  name,
  product,
  currency = 'BRL',
  showPrice = false,
  onPriceClick,
  onCheck,
  onClick,
  showQuantities,
  showCategories,
}) => {
  const [check, setCheck] = useState(checked);

  const value = useMemo(() => {
    if (product) {
      return formatCurrency((product.quantity || 0) * (product.price || 0), currency);
    }
    return 0;
  }, [currency, product]);

  const handleSearch = useDebouncedCallback(() => {
    onCheck?.();
  }, 500);

  const handleCheck = () => {
    setCheck(!check);
    handleSearch();
  };

  const shortenName = (name: string) => (name.length > 30 ? `${name.slice(0, 30)}...` : name);

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
        <Stack gap="1" flex={1}>
          <Title order={3} fz="sm" fw={500}>
            {shortenName(name)}
          </Title>
          {showCategories && product?.category && (
            <Text c="dimmed" fz="xs" fw={500}>
              {showCategories && product?.category}
            </Text>
          )}
        </Stack>
      </Group>
      <Group gap="xs">
        {showQuantities && (
          <Text c="dimmed" fz="xs" pl="xs" fw={500}>
            {product?.quantity}
          </Text>
        )}
        {product?.unit && (
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
            {product?.unit}
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