import React, { useMemo } from 'react';
import { Card, Checkbox, CheckboxProps, Flex, Group, Text, Title, Tooltip } from '@mantine/core';
import { Product } from '@/models/Product';
import { CurrencyMode, formatCurrency } from '@/utils/formatCurrency';
import classes from './ProductCheckbox.module.css';

export type ProductCheckboxProps = {
  name: string;
  product?: Omit<Product, 'id'>;
  currency?: CurrencyMode;
  onClick?: () => void;
} & CheckboxProps;

export const ProductCheckbox: React.FC<ProductCheckboxProps> = ({
  checked,
  opacity,
  name,
  product,
  currency = 'br',
  onClick,
}) => {
  const value = useMemo(() => {
    if (product) {
      return formatCurrency((product.quantity || 0) * (product.price || 0), currency);
    }
    return 0;
  }, [currency, product]);

  return (
    <Card opacity={opacity} className={classes.card} tabIndex={0} p={0} onClick={onClick}>
      <Flex p="sm" py="xs" align="center" justify="space-between" gap={12}>
        <Group gap="xs">
          <Tooltip label={checked ? 'Remove' : 'Add'}>
            <Checkbox checked={checked} />
          </Tooltip>
          <Title order={3} fz="sm" fw={500}>
            {product?.name || name}
          </Title>
        </Group>
        <Group gap="xs">
          <Text c="gray" fz="xs">
            {product?.quantity}
          </Text>
          <Text c="gray" fz="xs" fw="bolder">
            {value}
          </Text>
        </Group>
      </Flex>
    </Card>
  );
};
