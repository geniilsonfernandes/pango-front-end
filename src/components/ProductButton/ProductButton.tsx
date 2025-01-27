import React from 'react';
import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Button, ButtonVariant, Flex, ThemeIcon } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { Product } from '@/service/models/types';

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
  product?: Product;

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
  const handleRemoveDebounced = useDebouncedCallback(() => {
    onRemove?.();
  }, 200);

  const handleIncrementDebounced = useDebouncedCallback(() => {
    onIncrement?.();
  }, 200);

  const handleDecrementDebounced = useDebouncedCallback(() => {
    onDecrement?.();
  }, 200);

  return (
    <Button
      variant={variant}
      color="gray"
      px="xxs"
      justify="space-between"
      size="xs"
      radius="md"
      fullWidth
      aria-selected={!!product?.quantity}
      aria-labelledby={name}
      aria-label={name}
      leftSection={
        <ActionIcon
          loading={isLoading}
          component="span"
          onClick={(e) => {
            e.stopPropagation();
            handleIncrementDebounced();
          }}
          aria-label="increment-button"
          role="button"
          size="sm"
          radius="sm"
          variant={product ? 'filled' : 'subtle'}
          color={product ? 'green' : 'gray'}
        >
          <IconPlus size={16} />
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
              size="sm"
              radius="sm"
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                handleDecrementDebounced();
              }}
            >
              <IconMinus size={16} />
            </ActionIcon>
          </Flex>
        ) : (
          <ThemeIcon
            display={product ? 'flex' : 'none'}
            component="div"
            aria-label="remove-button"
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveDebounced();
            }}
            size="sm"
            radius="sm"
            variant="light"
            color="red"
          >
            <IconTrash size={16} />
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
