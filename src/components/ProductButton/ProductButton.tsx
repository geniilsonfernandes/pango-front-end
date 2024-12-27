import React from 'react';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Button, ButtonVariant, Flex, ThemeIcon } from '@mantine/core';
import { ShoppingItem } from '@/service/api';

/**
 * Props for the ProductButton component.
 */
export type ProductButtonProps = {
  /**
   * The name of the product displayed on the button.
   */
  name: string;

  /**
   * Callback function triggered when adding the product.
   */
  onIncrement?: () => void;

  /**
   * Callback function triggered when removing the product.
   */
  onRemove?: () => void;

  /**
   * Callback function triggered when decrementing the product quantity.
   */
  onDecrement?: () => void;

  /**
   * An optional Product object containing product details.
   */
  product?: ShoppingItem;

  /**
   * The variant of the button.
   * @default 'subtle'
   * @see https://mantine.dev/core/button
   */
  variant?: ButtonVariant;

  /**
   * Whether the button is loading.
   * @default false
   */
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * A button to manage products, with actions for adding, removing, or decrementing product quantities.
 *
 */
export const ProductButton: React.FC<ProductButtonProps> = ({
  name,
  variant = 'subtle',
  product,
  onIncrement,
  onDecrement,
  onRemove,
  isLoading,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color="gray"
      justify="space-between"
      size="xs"
      aria-selected={!!product?.quantity}
      aria-labelledby={name}
      aria-label={name}
      leftSection={
        <ActionIcon
          loading={isLoading}
          component="span"
          onClick={onIncrement}
          aria-label="increment-button"
          role="button"
          size="xs"
          radius="sm"
          variant={product ? 'filled' : 'subtle'}
          color={product ? 'green' : 'gray'}
        >
          <IconPlus size={14} />
        </ActionIcon>
      }
      rightSection={
        product?.quantity && product.quantity >= 2 ? (
          <Flex gap={8} align="center">
            <span aria-label="quantity">{product?.quantity}</span>
            <ActionIcon
              component="span"
              role="button"
              aria-label="decrement-button"
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                onDecrement?.();
              }}
            >
              <IconMinus />
            </ActionIcon>
          </Flex>
        ) : (
          <ThemeIcon
            display={product ? 'block' : 'none'}
            component="span"
            aria-label="remove-button"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            size={14}
            variant="subtle"
            color="red"
          >
            <IconTrash size={14} />
          </ThemeIcon>
        )
      }
      styles={{
        label: {
          width: '100%',
          textAlign: 'left',
        },
      }}
      {...props}
    >
      {name}
    </Button>
  );
};
