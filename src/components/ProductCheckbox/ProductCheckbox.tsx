import React, { useMemo } from 'react';
import { Button, Card, Checkbox, CheckboxProps, Group, Text, Title, Tooltip } from '@mantine/core';
import { Product } from '@/models/Product';
import { CurrencyMode, formatCurrency } from '@/utils/formatCurrency';
import { RenderIf } from '../RenderIf/RenderIf';
import classes from './ProductCheckbox.module.css';

export type ProductCheckboxProps = {
  name: string;
  product?: Omit<Product, 'id'>;
  currency?: CurrencyMode;
  showCurrency?: boolean;
  onCheck?: () => void;
  checked?: boolean;
  onPriceClick?: () => void;
  onClick?: () => void;
} & CheckboxProps;

export const ProductCheckbox: React.FC<ProductCheckboxProps> = ({
  checked,
  opacity,
  name,
  product,
  currency = 'br',
  showCurrency = false,
  onPriceClick,
  onCheck,
  onClick,
}) => {
  const value = useMemo(() => {
    if (product) {
      return formatCurrency((product.quantity || 0) * (product.price || 0), currency);
    }
    return 0;
  }, [currency, product]);

  const quantity = useMemo(() => {
    if (product) {
      return `${product.quantity} ${product?.unit || ''}`;
    }
    return 0;
  }, [product]);

  return (
    <Card opacity={opacity} className={classes.card} onClick={onClick}>
      <Group gap="xs">
        <Tooltip label={checked ? 'Remove' : 'Add'}>
          <Checkbox
            checked={checked}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onCheck?.();
            }}
          />
        </Tooltip>
        <Title order={3} fz="sm" fw={500}>
          {product?.name || name}
        </Title>
      </Group>
      <Group gap="xs">
        <Text c="gray" fz="xs">
          {quantity}
        </Text>
        <RenderIf condition={showCurrency}>
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
        </RenderIf>
      </Group>
    </Card>
  );
};
