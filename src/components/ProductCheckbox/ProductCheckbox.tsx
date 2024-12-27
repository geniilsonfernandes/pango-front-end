import React, { useMemo } from 'react';
import { Button, Card, Checkbox, CheckboxProps, Group, Text, Title, Tooltip } from '@mantine/core';
import { ShoppingItem } from '@/service/api';
import { CurrencyMode, formatCurrency } from '@/utils/formatCurrency';
import { RenderIf } from '../RenderIf/RenderIf';
import classes from './ProductCheckbox.module.css';

export type ProductCheckboxProps = {
  name: string;
  shoppingItem?: ShoppingItem;

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
  shoppingItem,
  currency = 'br',
  showCurrency = false,
  onPriceClick,
  onCheck,
  onClick,
}) => {
  const value = useMemo(() => {
    if (shoppingItem) {
      return formatCurrency((shoppingItem.quantity || 0) * (shoppingItem.price || 0), currency);
    }
    return 0;
  }, [currency, shoppingItem]);

  const quantity = useMemo(() => {
    if (shoppingItem) {
      return `${shoppingItem.quantity} ${shoppingItem?.unit || ''}`;
    }
    return 0;
  }, [shoppingItem]);

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
          {name}
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
